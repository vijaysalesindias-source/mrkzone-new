package com.mrkzone.service;

import com.mrkzone.exception.BadRequestException;
import com.mrkzone.model.Coupon;
import com.mrkzone.repository.CouponRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class CouponService {

    private final CouponRepository couponRepository;

    public CouponService(CouponRepository couponRepository) {
        this.couponRepository = couponRepository;
    }

    public Map<String, Object> validateAndCalculate(String code, Double orderAmount) {
        if (code == null || code.trim().isEmpty()) {
            throw new BadRequestException("Coupon code is required");
        }

        Optional<Coupon> opt = couponRepository.findByCodeIgnoreCaseAndActiveTrue(code.trim());
        if (opt.isEmpty()) {
            throw new BadRequestException("Invalid or inactive coupon code: " + code);
        }

        Coupon coupon = opt.get();
        if (orderAmount < coupon.getMinOrderValue()) {
            throw new BadRequestException("Minimum order value for coupon " + coupon.getCode() + " is ₹" + coupon.getMinOrderValue());
        }

        double discount = coupon.calculateDiscount(orderAmount);
        if (discount <= 0) {
            throw new BadRequestException("Coupon is not applicable to this order");
        }

        Map<String, Object> result = new HashMap<>();
        result.put("valid", true);
        result.put("code", coupon.getCode());
        result.put("description", coupon.getDescription());
        result.put("discountAmount", discount);
        result.put("finalAmount", Math.max(0.0, orderAmount - discount));
        result.put("discountType", coupon.getDiscountType().name());
        result.put("discountValue", coupon.getDiscountValue());
        return result;
    }

    @Transactional
    public void incrementUsage(String code) {
        if (code != null && !code.trim().isEmpty()) {
            couponRepository.findByCodeIgnoreCase(code.trim()).ifPresent(coupon -> {
                coupon.setTimesUsed(coupon.getTimesUsed() + 1);
                couponRepository.save(coupon);
            });
        }
    }
}
