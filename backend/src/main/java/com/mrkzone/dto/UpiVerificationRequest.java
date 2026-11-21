package com.mrkzone.dto;

import jakarta.validation.constraints.NotBlank;

public class UpiVerificationRequest {
    @NotBlank(message = "Order number is required")
    private String orderNumber;

    @NotBlank(message = "UPI Reference ID / UTR is required")
    private String upiRefId;

    public UpiVerificationRequest() {}

    public UpiVerificationRequest(String orderNumber, String upiRefId) {
        this.orderNumber = orderNumber;
        this.upiRefId = upiRefId;
    }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
    public String getUpiRefId() { return upiRefId; }
    public void setUpiRefId(String upiRefId) { this.upiRefId = upiRefId; }
}
