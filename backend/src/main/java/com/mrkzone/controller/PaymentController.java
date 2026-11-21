package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.dto.RazorpayPaymentVerifyRequest;
import com.mrkzone.dto.UpiVerificationRequest;
import com.mrkzone.model.Order;
import com.mrkzone.model.Payment;
import com.mrkzone.service.OrderService;
import com.mrkzone.service.PaymentService;
import com.mrkzone.service.UpiQrService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    private final PaymentService paymentService;
    private final OrderService orderService;
    private final UpiQrService upiQrService;

    public PaymentController(PaymentService paymentService,
                             OrderService orderService,
                             UpiQrService upiQrService) {
        this.paymentService = paymentService;
        this.orderService = orderService;
        this.upiQrService = upiQrService;
    }

    @GetMapping("/upi/{orderNumber}")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getUpiPaymentDetails(@PathVariable String orderNumber) {
        Order order = orderService.getOrderByNumber(orderNumber);
        Map<String, Object> details = upiQrService.getUpiPaymentDetails(orderNumber, order.getFinalAmount());
        return ResponseEntity.ok(ApiResponse.success("UPI QR details", details));
    }

    @PostMapping({"/verify/upi", "/upi/verify"})
    public ResponseEntity<ApiResponse<Payment>> verifyUpiPayment(@Valid @RequestBody UpiVerificationRequest request) {
        Payment payment = paymentService.verifyUpiPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Payment verified successfully", payment));
    }

    @PostMapping("/verify/razorpay")
    public ResponseEntity<ApiResponse<Payment>> verifyRazorpayPayment(@Valid @RequestBody RazorpayPaymentVerifyRequest request) {
        Payment payment = paymentService.verifyRazorpayPayment(request);
        return ResponseEntity.ok(ApiResponse.success("Razorpay payment verified successfully", payment));
    }
}
