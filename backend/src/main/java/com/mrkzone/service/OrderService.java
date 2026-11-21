package com.mrkzone.service;

import com.mrkzone.dto.CreateOrderRequest;
import com.mrkzone.dto.OrderStatusUpdateRequest;
import com.mrkzone.dto.PincodeCheckResponse;
import com.mrkzone.exception.BadRequestException;
import com.mrkzone.exception.ResourceNotFoundException;
import com.mrkzone.model.*;
import com.mrkzone.repository.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final PaymentRepository paymentRepository;
    private final CartService cartService;
    private final CouponService couponService;
    private final DeliveryService deliveryService;
    private final UpiQrService upiQrService;
    private final NotificationRepository notificationRepository;

    @Value("${mrkzone.shipping.free-shipping-threshold:499.0}")
    private Double freeShippingThreshold;

    public OrderService(OrderRepository orderRepository,
                        OrderItemRepository orderItemRepository,
                        ProductRepository productRepository,
                        UserRepository userRepository,
                        PaymentRepository paymentRepository,
                        CartService cartService,
                        CouponService couponService,
                        DeliveryService deliveryService,
                        UpiQrService upiQrService,
                        NotificationRepository notificationRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.paymentRepository = paymentRepository;
        this.cartService = cartService;
        this.couponService = couponService;
        this.deliveryService = deliveryService;
        this.upiQrService = upiQrService;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Order createOrder(CreateOrderRequest request, Long userId) {
        if (request.getItems() == null || request.getItems().isEmpty()) {
            throw new BadRequestException("Order must contain at least one product");
        }

        User user = null;
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
        }

        // Validate products and compute backend price
        double subtotal = 0.0;
        List<OrderItem> orderItems = new ArrayList<>();

        for (CreateOrderRequest.OrderItemRequest itemReq : request.getItems()) {
            Product product = productRepository.findById(itemReq.getProductId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "id", itemReq.getProductId()));

            if (itemReq.getQuantity() <= 0) {
                throw new BadRequestException("Quantity must be at least 1");
            }

            if (!product.isInStock() || product.getStockQuantity() < itemReq.getQuantity()) {
                throw new BadRequestException("Insufficient stock for product: " + product.getTitle() + " (Available: " + product.getStockQuantity() + ")");
            }

            // Deduct stock
            product.setStockQuantity(product.getStockQuantity() - itemReq.getQuantity());
            if (product.getStockQuantity() == 0) {
                product.setInStock(false);
            }
            productRepository.save(product);

            double itemTotal = product.getPrice() * itemReq.getQuantity();
            subtotal += itemTotal;

            OrderItem orderItem = new OrderItem();
            orderItem.setProduct(product);
            orderItem.setProductTitle(product.getTitle());
            orderItem.setProductSku(product.getSku());
            orderItem.setProductImage(product.getPrimaryImageUrl());
            orderItem.setUnitPrice(product.getPrice());
            orderItem.setQuantity(itemReq.getQuantity());
            orderItem.setTotalPrice(itemTotal);
            orderItems.add(orderItem);
        }

        // Coupon calculation
        double discountAmount = 0.0;
        String couponCode = null;
        if (request.getCouponCode() != null && !request.getCouponCode().trim().isEmpty()) {
            try {
                var couponResult = couponService.validateAndCalculate(request.getCouponCode().trim(), subtotal);
                discountAmount = (Double) couponResult.get("discountAmount");
                couponCode = request.getCouponCode().trim().toUpperCase();
                couponService.incrementUsage(couponCode);
            } catch (Exception e) {
                // If invalid, proceed without discount
            }
        }

        // Delivery calculation based on pincode
        PincodeCheckResponse deliveryCheck = deliveryService.checkPincode(request.getPostalCode(), subtotal);
        double shippingFee = 0.0;
        if (request.isExpressDelivery() && deliveryCheck.isExpressAvailable()) {
            shippingFee = deliveryCheck.getExpressShippingFee();
        } else {
            shippingFee = deliveryCheck.getStandardShippingFee();
        }

        // Tax calculation: 18% GST included in price or nominal calculation
        double taxAmount = Math.round(((subtotal - discountAmount) * 0.18) * 100.0) / 100.0;
        double finalAmount = Math.max(0.0, subtotal - discountAmount + shippingFee);

        // Generate unique order number (Amazon-style format)
        String orderNumber = "AMZ-" + (2026) + "-" + (10000 + new Random().nextInt(90000));

        Order order = new Order();
        order.setOrderNumber(orderNumber);
        order.setUser(user);
        order.setCustomerName(request.getCustomerName());
        order.setCustomerEmail(request.getCustomerEmail());
        order.setCustomerPhone(request.getCustomerPhone());

        String fullAddress = String.format("%s, %s%s, %s, %s - %s",
                request.getAddressLine1(),
                request.getAddressLine2() != null ? request.getAddressLine2() + ", " : "",
                request.getLandmark() != null ? "Near " + request.getLandmark() : "",
                request.getCity(),
                request.getState(),
                request.getPostalCode()
        );
        order.setShippingAddress(fullAddress);
        order.setShippingCity(request.getCity());
        order.setShippingState(request.getState());
        order.setShippingPincode(request.getPostalCode());
        order.setTotalAmount(subtotal);
        order.setDiscountAmount(discountAmount);
        order.setCouponCode(couponCode);
        order.setTaxAmount(taxAmount);
        order.setShippingFee(shippingFee);
        order.setFinalAmount(finalAmount);

        if (request.getPaymentMethod() == null || !"UPI_QR".equalsIgnoreCase(request.getPaymentMethod())) {
            throw new BadRequestException("Only prepaid Direct UPI QR payments are accepted. Cash on Delivery and other payment methods are disabled.");
        }
        Order.PaymentMethod pm = Order.PaymentMethod.UPI_QR;
        order.setPaymentMethod(pm);

        if (pm == Order.PaymentMethod.COD) {
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
            order.setOrderStatus(Order.OrderStatus.CONFIRMED);
        } else {
            order.setPaymentStatus(Order.PaymentStatus.PENDING);
            order.setOrderStatus(Order.OrderStatus.PENDING);
        }

        order.setEstimatedDeliveryDate(deliveryCheck.getFormattedDeliveryDate());
        order.setDeliveryNotes(request.getDeliveryNotes());
        order.setCourierName("Delhivery Express");
        order.setTrackingNumber("DELH" + (10000000 + new Random().nextInt(90000000)));

        Order savedOrder = orderRepository.save(order);

        // Save order items
        for (OrderItem oi : orderItems) {
            oi.setOrder(savedOrder);
            orderItemRepository.save(oi);
            savedOrder.getItems().add(oi);
        }

        // Create linked payment record
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setPaymentMethod(pm.name());
        payment.setAmount(finalAmount);
        payment.setCurrency("INR");
        payment.setStatus(Payment.PaymentStatus.PENDING);

        if (pm == Order.PaymentMethod.UPI_QR) {
            String upiUri = upiQrService.generateUpiUri(orderNumber, finalAmount);
            payment.setQrCodeData(upiUri);
        }
        paymentRepository.save(payment);

        // If user is logged in, clear their cart
        if (userId != null) {
            try {
                cartService.clearCart(userId);
            } catch (Exception ignored) {}

            notificationRepository.save(new Notification(
                    user,
                    "Order Placed Successfully!",
                    "Your order " + orderNumber + " for ₹" + String.format("%.2f", finalAmount) + " has been placed.",
                    "ORDER",
                    "/account/orders/" + orderNumber
            ));
        }

        return savedOrder;
    }

    public Order getOrderByNumber(String orderNumber) {
        return orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order", "orderNumber", orderNumber));
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Order cancelOrder(String orderNumber, String reason, Long userId) {
        Order order = getOrderByNumber(orderNumber);

        if (userId != null && order.getUser() != null && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this order");
        }

        if (order.getOrderStatus() == Order.OrderStatus.SHIPPED ||
            order.getOrderStatus() == Order.OrderStatus.OUT_FOR_DELIVERY ||
            order.getOrderStatus() == Order.OrderStatus.DELIVERED) {
            throw new BadRequestException("Order cannot be cancelled once shipped or delivered. You may request a return instead.");
        }

        if (order.getOrderStatus() == Order.OrderStatus.CANCELLED) {
            throw new BadRequestException("Order is already cancelled");
        }

        order.setOrderStatus(Order.OrderStatus.CANCELLED);
        order.setCancellationReason(reason);

        // Return stock back to inventory
        for (OrderItem item : order.getItems()) {
            if (item.getProduct() != null) {
                Product product = item.getProduct();
                product.setStockQuantity(product.getStockQuantity() + item.getQuantity());
                product.setInStock(true);
                productRepository.save(product);
            }
        }

        // If paid, mark payment for refund
        paymentRepository.findByOrderId(order.getId()).ifPresent(payment -> {
            if (payment.getStatus() == Payment.PaymentStatus.SUCCESS) {
                payment.setStatus(Payment.PaymentStatus.REFUNDED);
                paymentRepository.save(payment);
                order.setPaymentStatus(Order.PaymentStatus.REFUNDED);
                order.setRefundAmount(order.getFinalAmount());
            }
        });

        return orderRepository.save(order);
    }

    @Transactional
    public Order requestReturn(String orderNumber, String reason, String comments, Long userId) {
        Order order = getOrderByNumber(orderNumber);

        if (userId != null && order.getUser() != null && !order.getUser().getId().equals(userId)) {
            throw new BadRequestException("Unauthorized access to this order");
        }

        if (order.getOrderStatus() != Order.OrderStatus.DELIVERED) {
            throw new BadRequestException("Only delivered orders can be returned");
        }

        order.setOrderStatus(Order.OrderStatus.RETURN_REQUESTED);
        order.setReturnReason(reason + (comments != null ? " - " + comments : ""));
        return orderRepository.save(order);
    }

    @Transactional
    public Order updateOrderStatus(String orderNumber, OrderStatusUpdateRequest request) {
        Order order = getOrderByNumber(orderNumber);
        order.setOrderStatus(request.getStatus());

        if (request.getTrackingNumber() != null) {
            order.setTrackingNumber(request.getTrackingNumber());
        }
        if (request.getCourierName() != null) {
            order.setCourierName(request.getCourierName());
        }
        if (request.getEstimatedDeliveryDate() != null) {
            order.setEstimatedDeliveryDate(request.getEstimatedDeliveryDate());
        }
        if (request.getNotes() != null) {
            order.setDeliveryNotes(request.getNotes());
        }

        // If status marked as delivered and payment is COD, mark payment completed
        if (request.getStatus() == Order.OrderStatus.DELIVERED) {
            if (order.getPaymentMethod() == Order.PaymentMethod.COD) {
                order.setPaymentStatus(Order.PaymentStatus.COMPLETED);
                paymentRepository.findByOrderId(order.getId()).ifPresent(p -> {
                    p.setStatus(Payment.PaymentStatus.SUCCESS);
                    p.setPaidAt(LocalDateTime.now());
                    paymentRepository.save(p);
                });
            }
        }

        return orderRepository.save(order);
    }
}
