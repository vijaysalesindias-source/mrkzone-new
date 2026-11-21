package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.service.CouponService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/coupons")
public class CouponController {

    private final CouponService couponService;

    public CouponController(CouponService couponService) {
        this.couponService = couponService;
    }

    @PostMapping("/validate")
    public ResponseEntity<ApiResponse<Map<String, Object>>> validateCoupon(@RequestBody Map<String, Object> body) {
        String code = (String) body.get("code");
        Double amount = Double.valueOf(body.get("amount").toString());
        Map<String, Object> result = couponService.validateAndCalculate(code, amount);
        return ResponseEntity.ok(ApiResponse.success("Coupon applied", result));
    }
}
