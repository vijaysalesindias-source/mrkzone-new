package com.mrkzone.dto;

import jakarta.validation.constraints.NotBlank;

public class CancelOrderRequest {
    @NotBlank(message = "Cancellation reason is required")
    private String reason;

    public CancelOrderRequest() {}
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
