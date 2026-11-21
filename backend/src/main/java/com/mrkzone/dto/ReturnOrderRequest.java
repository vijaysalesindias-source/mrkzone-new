package com.mrkzone.dto;

import jakarta.validation.constraints.NotBlank;

public class ReturnOrderRequest {
    @NotBlank(message = "Return reason is required")
    private String reason;

    private String comments;

    public ReturnOrderRequest() {}
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public String getComments() { return comments; }
    public void setComments(String comments) { this.comments = comments; }
}
