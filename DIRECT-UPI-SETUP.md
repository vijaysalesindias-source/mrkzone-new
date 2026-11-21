# Direct UPI QR checkout

This project is configured for direct UPI QR checkout only. Cash on Delivery, card, net-banking and gateway checkout options are disabled in the checkout flow; the backend rejects order creation unless `paymentMethod` is `UPI_QR`.

## Configure your merchant QR

1. Copy `backend/.env.example` to `backend/.env` (or set the same environment variables in your hosting provider).
2. Set `MERCHANT_UPI_ID` to your own verified merchant UPI ID and `MERCHANT_NAME` to the name customers should see in their UPI app.
3. Never use a sample UPI ID. Do not commit `.env` or share it publicly.
4. Restart the Spring Boot backend.

For every order, the backend creates a UPI URI containing the merchant UPI ID, exact final amount in INR, order number as transaction reference, and an order note. The frontend renders that URI as a QR code.

## Payment confirmation limitation

A static/dynamic UPI QR URI does not provide your website with a trusted payment callback. Customer-entered UTR is stored as **Pending** and does not mark the order paid. Verify the credit in your bank/merchant UPI app before manually confirming/fulfilling the order. Do not trust screenshots, app-return links, or UTR text alone. Automatic confirmation requires a bank/UPI provider API or payment gateway, which this project intentionally does not use.
