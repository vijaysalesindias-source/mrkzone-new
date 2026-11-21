package com.mrkzone.service;

import com.mrkzone.dto.RazorpayPaymentVerifyRequest;
import com.mrkzone.dto.UpiVerificationRequest;
import com.mrkzone.exception.BadRequestException;
import com.mrkzone.exception.ResourceNotFoundException;
import com.mrkzone.model.Order;
import com.mrkzone.model.Payment;
import com.mrkzone.repository.OrderRepository;
import com.mrkzone.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.HexFormat;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final OrderRepository orderRepository;

    @Value("${mrkzone.razorpay.key-secret:MRKZoneMockSecret12345}")
    private String razorpaySecret;

    public PaymentService(PaymentRepository paymentRepository, OrderRepository orderRepository) {
        this.paymentRepository = paymentRepository;
        this.orderRepository = orderRepository;
    }

    @Transactional
    public Payment verifyUpiPayment(UpiVerificationRequest request) {
        Order order = orderRepository.findByOrderNumber(request.getOrderNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", request.getOrderNumber()));
        if (order.getPaymentStatus() == Order.PaymentStatus.COMPLETED) {
            throw new BadRequestException("This order has already been paid and confirmed.");
        }
        String utr = request.getUpiRefId().trim();
        Optional<Payment> existingWithUtr = paymentRepository.findByUpiRefId(utr);
        if (existingWithUtr.isPresent() && !existingWithUtr.get().getOrder().getId().equals(order.getId())) {
            throw new BadRequestException("This UPI reference / UTR has already been submitted for another order.");
        }
        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order: " + request.getOrderNumber()));
        payment.setUpiRefId(utr);
        payment.setTransactionId("UPI-" + utr);
        // Customer-submitted UTR is only a claim, never proof of settlement.
        payment.setStatus(Payment.PaymentStatus.PENDING);
        payment.setPaidAt(null);
        paymentRepository.save(payment);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setOrderStatus(Order.OrderStatus.PENDING);
        orderRepository.save(order);
        return payment;
    }

    @Transactional
    public Payment verifyRazorpayPayment(RazorpayPaymentVerifyRequest request) {
        Order order = orderRepository.findByOrderNumber(request.getOrderNumber())
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", request.getOrderNumber()));

        if (order.getPaymentStatus() == Order.PaymentStatus.COMPLETED) {
            throw new BadRequestException("Order is already paid.");
        }

        // Verify Razorpay signature: HMAC_SHA256(order_id + "|" + payment_id, secret)
        String payload = request.getRazorpayOrderId() + "|" + request.getRazorpayPaymentId();
        boolean signatureValid = verifyHmacSha256(payload, request.getRazorpaySignature(), razorpaySecret);

        // Allow test sandbox mode verification if secret is mock or signature verified
        if (!signatureValid && !razorpaySecret.contains("Mock")) {
            throw new BadRequestException("Payment signature verification failed");
        }

        Payment payment = paymentRepository.findByOrderId(order.getId())
                .orElseGet(() -> {
                    Payment p = new Payment();
                    p.setOrder(order);
                    p.setPaymentMethod("RAZORPAY");
                    p.setAmount(order.getFinalAmount());
                    return p;
                });

        payment.setRazorpayOrderId(request.getRazorpayOrderId());
        payment.setRazorpayPaymentId(request.getRazorpayPaymentId());
        payment.setRazorpaySignature(request.getRazorpaySignature());
        payment.setTransactionId(request.getRazorpayPaymentId());
        payment.setStatus(Payment.PaymentStatus.SUCCESS);
        payment.setPaidAt(LocalDateTime.now());
        paymentRepository.save(payment);

        order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
        if (order.getOrderStatus() == Order.OrderStatus.PENDING) {
            order.setOrderStatus(Order.OrderStatus.CONFIRMED);
        }
        orderRepository.save(order);

        return payment;
    }

    public Payment getPaymentByOrderId(Long orderId) {
        return paymentRepository.findByOrderId(orderId)
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found for order id: " + orderId));
    }

    private boolean verifyHmacSha256(String data, String signature, String secret) {
        try {
            Mac sha256_HMAC = Mac.getInstance("HmacSHA256");
            SecretKeySpec secret_key = new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256");
            sha256_HMAC.init(secret_key);
            byte[] hash = sha256_HMAC.doFinal(data.getBytes(StandardCharsets.UTF_8));
            String generated = HexFormat.of().formatHex(hash);
            return generated.equalsIgnoreCase(signature);
        } catch (Exception e) {
            return false;
        }
    }
}
