# MRK ZONE — Amazon-Level E-Commerce Marketplace Platform

A complete, production-ready, enterprise-grade e-commerce marketplace built for **MRK ZONE**, inspired by the shopping experience, usability, and professional interface of Amazon's website.

---

## 🌟 Highlights & Architecture

### Fullstack Monolith & Microservices Ready
- **Frontend**: React 18 + Vite + Tailwind CSS + Lucide Icons + QRCode.react + Canvas Confetti
- **Backend**: Spring Boot 3.3.4 + Java 21 (RESTful APIs, Spring Security 6, JWT, Spring Data JPA, Hibernate, Bean Validation)
- **Database**: Relational Database Architecture (Default H2 in PostgreSQL mode with persistence, ready for PostgreSQL in production)
- **Payments**: Genuine Dynamic UPI QR Code generator (NPCI UPI Intent URI), Razorpay Gateway, Card Payments, Net Banking, and Cash on Delivery
- **Logistics**: PIN-code-based delivery calculation from central warehouse in **Mumbai (PIN 400072)** with free shipping rules (orders ₹499+)

---

## 🚀 Live Services & Endpoints

| Service | URL | Description |
| :--- | :--- | :--- |
| **Storefront Web App** | `http://localhost:8080/` | Full-stack Amazon-level marketplace (Served directly by Spring Boot) |
| **Vite Dev Server** | `http://localhost:5173/` | React Hot-Module-Replacement Dev Server (Proxied to backend) |
| **Swagger UI** | `http://localhost:8080/swagger-ui.html` | Interactive OpenAPI 3.0 API Documentation |
| **API Base URL** | `http://localhost:8080/api/` | Secure REST API |
| **H2 Database Console** | `http://localhost:8080/h2-console` | JDBC URL: `jdbc:h2:file:./data/mrkzone;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE` |

---

## 🔑 Demo Accounts

Use the dedicated `/admin` login page for administrator access. The local demo credentials below are seeded by the backend:

| Role | Email | Password | Privileges |
| :--- | :--- | :--- | :--- |
| **Administrator (seeded local account)** | `admin@amazon.com` | `Admin@12345` | Full Admin Dashboard, Catalog, Orders, Refunds, Coupons, Banners |
| **Customer** | `customer@mrkzone.com` | `Customer@12345` | Shopping, Saved Addresses, Order Tracking, Wishlist, Reviews |

> **Guest Browsing & Checkout**: Shoppers can browse, filter, search, bundle, and place orders without mandatory registration.

---

## 🎟️ Active Promotional Coupons

| Coupon Code | Discount | Minimum Order Value | Max Discount Cap |
| :--- | :--- | :--- | :--- |
| `MRK100` | Flat ₹100 OFF | ₹999 | ₹100 |
| `SUPER500` | Flat ₹500 OFF | ₹3,999 | ₹500 |
| `WELCOME10` | 10% Discount | ₹500 | ₹1,000 |
| `FESTIVE20` | 20% Festive Savings | ₹5,000 | ₹2,500 |

---

## 📦 Features Implemented

### 1. Amazon-Level Marketplace Storefront
- Professional Amazon Navy (`#131921`) and Blue (`#232f3e`) Header with Amber accents
- Large Search Bar with debounced live autocomplete suggestions and category picker
- "All" Navigation Drawer (Mega Menu) with categorized departments
- Hero Promotional Slider with auto-scroll and gradient blend mask
- Multi-Card Category Grid (Electronics, Mobiles, Fashion, Kitchen)
- Today's Lightning Deals with real-time countdown clock and savings badges
- Horizontal Product Carousels for Best Sellers, Trending, Audio, and Smartphones
- Featured Brand Showcase (Apple, Samsung, Sony, ASUS ROG, boAt, Nike, Philips)
- Trust Badges strip & comprehensive 4-column Amazon footer

### 2. Deep Product Detail Experience
- Multi-Image Thumbnail Gallery with interactive hover zoom canvas
- Product Video Tab with embedded media player
- Dynamic Price & Savings Breakdown ("You Save ₹X (Y%)")
- Available Offers Box (Bank Discounts, No Cost EMI, UPI QR discounts)
- Product Specifications Table (technical specs, SKU, model number, warranty)
- Delivery PIN Code Checker (validates destination PIN against central hub 400072)
- Frequently Bought Together Bundle with dual add-to-cart functionality
- Customer Reviews & Ratings breakdown with verified purchase badges & helpful voting

### 3. Search & Filter System
- Dynamic multi-faceted filtering: Department, Brand checkboxes, Price range slider, Star rating filters, and In-Stock toggle
- Sorting: Featured/Relevance, Price (Low to High), Price (High to Low), Customer Reviews, Newest
- Real-time result counts and responsive mobile filter drawer

### 4. Shopping Cart & 4-Step Checkout
- Cart persistence with item quantity increments, stock checking, and delete
- Move to Wishlist from cart
- Free shipping progress bar (eligibility above ₹499)
- Multi-step Amazon Checkout:
  - **Step 1**: Delivery Address (select saved address or enter guest details)
  - **Step 2**: Delivery Speed (Standard Free/₹40 or Express ₹99)
  - **Step 3**: Payment Option (Dynamic UPI QR, Razorpay Gateway, Cards, Net Banking, COD)
  - **Step 4**: Order Review & Place Order

### 5. Genuine Dynamic UPI QR Code & Payments
- Generates standard NPCI UPI Intent URI:
  `upi://pay?pa=mrkzone@okaxis&pn=MRK%20ZONE%20Retail&am=XXXX.XX&cu=INR&tn=Order%20MRK-XXXXX&tr=MRK-XXXXX`
- Dynamic QR modal with exact payable amount, merchant name, 10-minute expiration countdown timer, copy UPI ID button, and UTR verification
- Prevents order confirmation without verified payment reconciliation
- Prevents duplicate payments and duplicate UTR reuse
- Supports simulated app scan & instant verification for testing

### 6. Order Management & Tax Invoices
- Complete lifecycle: `PENDING` ➔ `CONFIRMED` ➔ `PROCESSING` ➔ `SHIPPED` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED` ➔ `CANCELLED` ➔ `RETURNED` ➔ `REFUNDED`
- Visual package tracking timeline with courier name (`Delhivery Express`) and AWB tracking numbers
- Printable & downloadable GST Tax Invoice with GSTIN `27AABCM9812K1Z8`, HSN codes, and 18% CGST/SGST tax breakdown
- Cancellation support with automatic inventory restocking

### 7. Comprehensive Admin Dashboard
- Analytics: Total Revenue, Total Orders, Active Customers, Live Products, and Monthly Revenue trend chart
- Product Management: Add, edit, permanently delete, manage stock, SKU, up to 7 images, video, and featured/trending flags
- Order Management: Filter orders by status, update courier tracking numbers, and process refunds
- Customer Management: View registered shoppers and toggle active status
- Coupon Management: Create new promo codes with percentage or fixed discount, usage limits, and minimum order values
- Review Moderation: Approve or remove customer reviews

---

## 🛠️ Project Structure

```
az/
├── backend/
│   ├── pom.xml
│   ├── src/main/java/com/mrkzone/
│   │   ├── MrkzoneBackendApplication.java
│   │   ├── config/             # SecurityConfig, WebConfig (SPA resolver), OpenApiConfig
│   │   ├── controller/         # Auth, Product, Order, Payment, Cart, Admin, Review, Delivery
│   │   ├── dto/                # Request & Response DTOs
│   │   ├── exception/          # GlobalExceptionHandler, ResourceNotFound, BadRequest
│   │   ├── model/              # 20 JPA Entities (User, Product, Order, Payment, Coupon, etc.)
│   │   ├── repository/         # 20 Spring Data JPA Repositories
│   │   ├── security/           # JwtTokenProvider, JwtAuthenticationFilter, UserPrincipal
│   │   └── service/            # Business services & DataInitializer
│   └── src/main/resources/
│       ├── application.yml     # Database & payment configuration
│       └── static/             # Production bundled React SPA assets
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── src/
│       ├── App.jsx             # Main router & layout
│       ├── components/         # Navbar, CategoryBar, HeroSlider, ProductCard, UpiQrModal, InvoiceView
│       ├── context/            # AuthContext, CartContext, WishlistContext, ToastContext
│       ├── pages/              # HomePage, ProductDetailPage, ProductListingPage, CartPage, CheckoutPage, AdminDashboardPage
│       └── services/api.js     # Unified REST API client
└── README.md
```

---

## 💻 How to Run

### Option 1: Run Fullstack Production App (Single Command)
```bash
cd backend
mvn clean package -DskipTests
java -jar target/mrkzone-backend-1.0.0.jar
```
Visit **`http://localhost:8080/`** in your browser.

### Option 2: Run with Vite Dev Server (Hot Module Reloading)
**Terminal 1 (Backend):**
```bash
cd backend
java -jar target/mrkzone-backend-1.0.0.jar
```
**Terminal 2 (Frontend):**
```bash
cd frontend
npm run dev
```
Visit **`http://localhost:5173/`** in your browser.

## Admin sign-in and product photo workflow
- Open `http://localhost:5173/admin` when using the Vite development server, or `http://localhost:8080/admin` when using the bundled Spring Boot app.
- Sign in with the seeded local administrator account shown above. The Admin Login page also appears in the Account & Lists menu and the mobile menu. After a successful administrator sign-in, the same menu shows Admin Control Panel.
- Change the demo administrator password before exposing this application to the internet; the seeded password is for local development only.
- Admins can add, edit, and delete products from the Admin Dashboard.
- Product photos are selected from the device using the file picker; there is no manual image-URL field.
- Each selected image uploads immediately to the protected `/api/admin/uploads` endpoint. The server returns the generated image URL and the product form stores it automatically.
- Product photo uploads and all `/api/admin/**` endpoints require an authenticated `ROLE_ADMIN` account.
- To refresh the bundled production storefront after frontend source changes, run `cd frontend && npm ci && npm run build`, then copy the generated `frontend/dist` contents into `backend/src/main/resources/static` before packaging the backend.


## Admin login and product image storage

Configure these environment variables in the backend deployment (Render or equivalent):

- `ADMIN_EMAIL`: the store administrator email (default for local development: `admin@mrkzone.com`)
- `ADMIN_PASSWORD`: a strong unique password (local development default: `Admin@12345`)
- `ADMIN_NAME`: administrator display name
- `JWT_SECRET`: a private Base64-encoded secret of at least 32 decoded bytes; keep it stable between deploys
- `UPLOAD_DIR`: persistent upload directory (for a Render persistent disk, for example `/var/data/uploads`)

The configured admin account is created/updated at backend startup. After changing `ADMIN_PASSWORD`, restart/redeploy the backend and sign in with `ADMIN_EMAIL` and the new password. Do not use the development default password on a public deployment.

Product upload URLs are stored as `/uploads/products/...`; the frontend now resolves these against the backend API origin. For production, mount a persistent disk at the path used by `UPLOAD_DIR`, otherwise local uploaded files can disappear after a redeploy or instance replacement.
