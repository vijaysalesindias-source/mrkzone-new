package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.dto.CancelOrderRequest;
import com.mrkzone.dto.CreateOrderRequest;
import com.mrkzone.dto.ReturnOrderRequest;
import com.mrkzone.model.Order;
import com.mrkzone.security.UserPrincipal;
import com.mrkzone.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping("/checkout")
    public ResponseEntity<ApiResponse<Order>> checkout(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateOrderRequest request) {
        Long userId = (principal != null) ? principal.getId() : null;
        Order order = orderService.createOrder(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Order placed successfully", order));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<List<Order>>> getMyOrders(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        List<Order> orders = orderService.getUserOrders(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Orders retrieved", orders));
    }

    @GetMapping("/track/{orderNumber}")
    public ResponseEntity<ApiResponse<Order>> trackOrder(@PathVariable String orderNumber) {
        Order order = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success("Order found", order));
    }

    @PostMapping("/{orderNumber}/cancel")
    public ResponseEntity<ApiResponse<Order>> cancelOrder(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String orderNumber,
            @Valid @RequestBody CancelOrderRequest request) {
        Long userId = (principal != null) ? principal.getId() : null;
        Order order = orderService.cancelOrder(orderNumber, request.getReason(), userId);
        return ResponseEntity.ok(ApiResponse.success("Order cancelled successfully", order));
    }

    @PostMapping("/{orderNumber}/return")
    public ResponseEntity<ApiResponse<Order>> requestReturn(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable String orderNumber,
            @Valid @RequestBody ReturnOrderRequest request) {
        Long userId = (principal != null) ? principal.getId() : null;
        Order order = orderService.requestReturn(orderNumber, request.getReason(), request.getComments(), userId);
        return ResponseEntity.ok(ApiResponse.success("Return request submitted", order));
    }
}
