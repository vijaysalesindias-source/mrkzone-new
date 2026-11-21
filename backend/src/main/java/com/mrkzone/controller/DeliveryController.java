package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.dto.PincodeCheckResponse;
import com.mrkzone.service.DeliveryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    private final DeliveryService deliveryService;

    public DeliveryController(DeliveryService deliveryService) {
        this.deliveryService = deliveryService;
    }

    @GetMapping("/check")
    public ResponseEntity<ApiResponse<PincodeCheckResponse>> checkPincode(
            @RequestParam String pincode,
            @RequestParam(required = false, defaultValue = "0.0") Double subtotal) {
        PincodeCheckResponse response = deliveryService.checkPincode(pincode, subtotal);
        return ResponseEntity.ok(ApiResponse.success("Pincode check result", response));
    }
}
