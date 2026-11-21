package com.mrkzone.model;

import jakarta.persistence.*;
import java.time.LocalDate;

@Entity
@Table(name = "coupons")
public class Coupon {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DiscountType discountType = DiscountType.FIXED;

    @Column(nullable = false)
    private Double discountValue;

    private Double minOrderValue = 0.0;

    private Double maxDiscountAmount;

    private Integer usageLimit = 1000;

    private Integer timesUsed = 0;

    private LocalDate validFrom = LocalDate.now();

    private LocalDate validUntil = LocalDate.now().plusMonths(3);

    private boolean active = true;

    public enum DiscountType {
        PERCENTAGE,
        FIXED
    }

    public Coupon() {}

    public Coupon(String code, String description, DiscountType discountType, Double discountValue, Double minOrderValue, Double maxDiscountAmount) {
        this.code = code;
        this.description = description;
        this.discountType = discountType;
        this.discountValue = discountValue;
        this.minOrderValue = minOrderValue;
        this.maxDiscountAmount = maxDiscountAmount;
        this.active = true;
    }

    public Double calculateDiscount(Double orderAmount) {
        if (!active || orderAmount < minOrderValue) {
            return 0.0;
        }
        if (validUntil != null && LocalDate.now().isAfter(validUntil)) {
            return 0.0;
        }
        if (usageLimit != null && timesUsed >= usageLimit) {
            return 0.0;
        }

        double discount = 0.0;
        if (discountType == DiscountType.PERCENTAGE) {
            discount = (orderAmount * discountValue) / 100.0;
            if (maxDiscountAmount != null && discount > maxDiscountAmount) {
                discount = maxDiscountAmount;
            }
        } else {
            discount = discountValue;
        }

        return Math.min(discount, orderAmount);
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public DiscountType getDiscountType() { return discountType; }
    public void setDiscountType(DiscountType discountType) { this.discountType = discountType; }
    public Double getDiscountValue() { return discountValue; }
    public void setDiscountValue(Double discountValue) { this.discountValue = discountValue; }
    public Double getMinOrderValue() { return minOrderValue; }
    public void setMinOrderValue(Double minOrderValue) { this.minOrderValue = minOrderValue; }
    public Double getMaxDiscountAmount() { return maxDiscountAmount; }
    public void setMaxDiscountAmount(Double maxDiscountAmount) { this.maxDiscountAmount = maxDiscountAmount; }
    public Integer getUsageLimit() { return usageLimit; }
    public void setUsageLimit(Integer usageLimit) { this.usageLimit = usageLimit; }
    public Integer getTimesUsed() { return timesUsed; }
    public void setTimesUsed(Integer timesUsed) { this.timesUsed = timesUsed; }
    public LocalDate getValidFrom() { return validFrom; }
    public void setValidFrom(LocalDate validFrom) { this.validFrom = validFrom; }
    public LocalDate getValidUntil() { return validUntil; }
    public void setValidUntil(LocalDate validUntil) { this.validUntil = validUntil; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
