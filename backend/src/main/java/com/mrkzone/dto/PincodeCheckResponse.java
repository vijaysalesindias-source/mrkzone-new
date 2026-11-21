package com.mrkzone.dto;

import java.time.LocalDate;

public class PincodeCheckResponse {
    private String pincode;
    private boolean serviceable;
    private String zoneName;
    private Integer estimatedDays;
    private LocalDate estimatedDeliveryDate;
    private String formattedDeliveryDate;
    private Double standardShippingFee;
    private boolean expressAvailable;
    private Double expressShippingFee;
    private boolean freeDeliveryEligible;
    private Double freeShippingThreshold;
    private String message;

    public PincodeCheckResponse() {}

    public String getPincode() { return pincode; }
    public void setPincode(String pincode) { this.pincode = pincode; }
    public boolean isServiceable() { return serviceable; }
    public void setServiceable(boolean serviceable) { this.serviceable = serviceable; }
    public String getZoneName() { return zoneName; }
    public void setZoneName(String zoneName) { this.zoneName = zoneName; }
    public Integer getEstimatedDays() { return estimatedDays; }
    public void setEstimatedDays(Integer estimatedDays) { this.estimatedDays = estimatedDays; }
    public LocalDate getEstimatedDeliveryDate() { return estimatedDeliveryDate; }
    public void setEstimatedDeliveryDate(LocalDate estimatedDeliveryDate) { this.estimatedDeliveryDate = estimatedDeliveryDate; }
    public String getFormattedDeliveryDate() { return formattedDeliveryDate; }
    public void setFormattedDeliveryDate(String formattedDeliveryDate) { this.formattedDeliveryDate = formattedDeliveryDate; }
    public Double getStandardShippingFee() { return standardShippingFee; }
    public void setStandardShippingFee(Double standardShippingFee) { this.standardShippingFee = standardShippingFee; }
    public boolean isExpressAvailable() { return expressAvailable; }
    public void setExpressAvailable(boolean expressAvailable) { this.expressAvailable = expressAvailable; }
    public Double getExpressShippingFee() { return expressShippingFee; }
    public void setExpressShippingFee(Double expressShippingFee) { this.expressShippingFee = expressShippingFee; }
    public boolean isFreeDeliveryEligible() { return freeDeliveryEligible; }
    public void setFreeDeliveryEligible(boolean freeDeliveryEligible) { this.freeDeliveryEligible = freeDeliveryEligible; }
    public Double getFreeShippingThreshold() { return freeShippingThreshold; }
    public void setFreeShippingThreshold(Double freeShippingThreshold) { this.freeShippingThreshold = freeShippingThreshold; }
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
