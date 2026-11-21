package com.mrkzone.service;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.HashMap;
import java.util.Map;

@Service
public class UpiQrService {

    @Value("${mrkzone.merchant.upi-id:amazonpay@apl}")
    private String merchantUpiId;

    @Value("${mrkzone.merchant.name:Amazon Retail India}")
    private String merchantName;

    public String generateUpiUri(String orderNumber, Double amount) {
        if (merchantUpiId == null || merchantUpiId.isBlank() || merchantName == null || merchantName.isBlank()) {
            throw new IllegalStateException("Configure MERCHANT_UPI_ID and MERCHANT_NAME before accepting UPI payments.");
        }
        String formattedAmount = String.format(java.util.Locale.ROOT, "%.2f", amount);
        String encodedName = URLEncoder.encode(merchantName, StandardCharsets.UTF_8);
        String note = URLEncoder.encode("Order " + orderNumber, StandardCharsets.UTF_8);

        // Standard Indian National Payments Corporation of India (NPCI) UPI Intent URI specification
        return String.format(
                "upi://pay?pa=%s&pn=%s&am=%s&cu=INR&tn=%s&tr=%s",
                URLEncoder.encode(merchantUpiId, StandardCharsets.UTF_8),
                encodedName,
                formattedAmount,
                note,
                orderNumber
        );
    }

    public String generateQrCodeBase64(String text, int width, int height) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
            byte[] qrBytes = outputStream.toByteArray();

            return "data:image/png;base64," + Base64.getEncoder().encodeToString(qrBytes);
        } catch (Exception e) {
            return null;
        }
    }

    public Map<String, Object> getUpiPaymentDetails(String orderNumber, Double amount) {
        String upiUri = generateUpiUri(orderNumber, amount);
        String qrCodeBase64 = generateQrCodeBase64(upiUri, 320, 320);

        Map<String, Object> details = new HashMap<>();
        details.put("orderNumber", orderNumber);
        details.put("payableAmount", amount);
        details.put("formattedAmount", "₹" + String.format("%,.2f", amount));
        details.put("merchantUpiId", merchantUpiId);
        details.put("merchantName", merchantName);
        details.put("upiUri", upiUri);
        details.put("qrCodeImage", qrCodeBase64);
        details.put("currency", "INR");
        details.put("instructions", "Scan using PhonePe, Google Pay, Paytm, BHIM, or any UPI app to complete payment.");

        return details;
    }

    public String getMerchantUpiId() { return merchantUpiId; }
    public String getMerchantName() { return merchantName; }
}
