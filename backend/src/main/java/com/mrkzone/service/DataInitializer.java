
package com.mrkzone.service;

import com.mrkzone.model.*;
import com.mrkzone.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductRepository productRepository;
    private final ProductImageRepository productImageRepository;
    private final CouponRepository couponRepository;
    private final BannerRepository bannerRepository;
    private final DeliveryZoneRepository deliveryZoneRepository;
    private final ReviewRepository reviewRepository;
    private final AddressRepository addressRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${mrkzone.admin.email:admin@mrkzone.com}")
    private String adminEmail;

    @Value("${mrkzone.admin.password}")
    private String adminPassword;

    @Value("${mrkzone.admin.name:Store Administrator}")
    private String adminName;

    public DataInitializer(UserRepository userRepository,
                           CategoryRepository categoryRepository,
                           BrandRepository brandRepository,
                           ProductRepository productRepository,
                           ProductImageRepository productImageRepository,
                           CouponRepository couponRepository,
                           BannerRepository bannerRepository,
                           DeliveryZoneRepository deliveryZoneRepository,
                           ReviewRepository reviewRepository,
                           AddressRepository addressRepository,
                           PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productRepository = productRepository;
        this.productImageRepository = productImageRepository;
        this.couponRepository = couponRepository;
        this.bannerRepository = bannerRepository;
        this.deliveryZoneRepository = deliveryZoneRepository;
        this.reviewRepository = reviewRepository;
        this.addressRepository = addressRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // Create/update the single configured store administrator. Set ADMIN_EMAIL
        // and ADMIN_PASSWORD in production hosting; no public admin registration exists.
        String configuredAdminEmail = adminEmail.toLowerCase().trim();
        User configuredAdmin = userRepository.findByEmail(configuredAdminEmail).orElseGet(User::new);
        configuredAdmin.setEmail(configuredAdminEmail);
        configuredAdmin.setPassword(passwordEncoder.encode(adminPassword));
        configuredAdmin.setFullName(adminName);
        configuredAdmin.setRole(User.Role.ROLE_ADMIN);
        configuredAdmin.setActive(true);
        configuredAdmin.setEmailVerified(true);
        userRepository.save(configuredAdmin);

        if (!couponRepository.existsByCodeIgnoreCase("AMAZON100")) {
            couponRepository.save(new Coupon(
                    "AMAZON100",
                    "Flat ₹100 OFF on orders above ₹999",
                    Coupon.DiscountType.FIXED,
                    100.0, 999.0, 100.0
            ));
        }

        seedAdditionalAmazonCatalog();
        // Keep the mobile catalogue available even when the database was initialized earlier.
        seedMobileCatalog();

        // Always initialize delivery zones, even if database already exists
        seedDeliveryZones();

        if (userRepository.count() > 2) {
            return; // Already initialized full catalog
        }

        // 3. Categories
        Category catElectronics = categoryRepository.save(new Category(
                "Electronics", "electronics", "Televisions, Home Entertainment, Smart Tech",
                "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=600", "Tv", true, 1
        ));

        Category catMobiles = categoryRepository.save(new Category(
                "Smartphones & Accessories", "smartphones", "Latest 5G Phones, Chargers, Cases",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600", "Smartphone", true, 2
        ));

        Category catLaptops = categoryRepository.save(new Category(
                "Computers & Laptops", "laptops-computers", "Ultrabooks, Gaming Rigs, Monitors",
                "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600", "Laptop", true, 3
        ));

        Category catAudio = categoryRepository.save(new Category(
                "Audio & Headphones", "audio-headphones", "TWS Earbuds, Over-Ear ANC, Soundbars",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", "Headphones", true, 4
        ));

        Category catWearables = categoryRepository.save(new Category(
                "Smartwatches & Wearables", "smartwatches", "Fitness Trackers, Luxury Smartwatches",
                "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", "Watch", true, 5
        ));

        Category catFashion = categoryRepository.save(new Category(
                "Fashion & Apparel", "fashion", "Men's, Women's Clothing & Outerwear",
                "https://images.unsplash.com/photo-1445205170230-053b83016050?w=600", "Shirt", true, 6
        ));

        Category catFootwear = categoryRepository.save(new Category(
                "Footwear & Sneakers", "footwear", "Running Shoes, Casual Sneakers, Formal",
                "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", "Footprints", true, 7
        ));

        Category catHome = categoryRepository.save(new Category(
                "Home & Kitchen", "home-kitchen", "Appliances, Cookware, Smart Home",
                "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600", "Home", true, 8
        ));

        // 4. Brands
        Brand brandApple = getOrCreateBrand(
                "Apple", "apple",
                "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg",
                "Designed in California", true
        );

        Brand brandSamsung = getOrCreateBrand(
                "Samsung", "samsung",
                "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
                "Do what you can't", true
        );

        Brand brandSony = getOrCreateBrand(
                "Sony", "sony",
                "https://upload.wikimedia.org/wikipedia/commons/c/ca/Sony_logo.svg",
                "Be Moved", true
        );

        Brand brandOnePlus = getOrCreateBrand(
                "OnePlus", "oneplus",
                "https://upload.wikimedia.org/wikipedia/commons/2/22/OnePlus_logo.svg",
                "Never Settle", true
        );

        Brand brandBoat = getOrCreateBrand(
                "boAt", "boat",
                "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200",
                "Plug into Nirvana", true
        );

        Brand brandAsus = getOrCreateBrand(
                "ASUS", "asus",
                "https://upload.wikimedia.org/wikipedia/commons/d/de/AsusTek-black-logo.svg",
                "In Search of Incredible", true
        );

        Brand brandNike = getOrCreateBrand(
                "Nike", "nike",
                "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
                "Just Do It", true
        );

        Brand brandPhilips = getOrCreateBrand(
                "Philips", "philips",
                "https://upload.wikimedia.org/wikipedia/commons/c/cb/Philips_logo.svg",
                "Innovation and You", true
        );

        // 5. Products
        createSampleProduct(
                "Apple iPhone 15 Pro (128 GB) - Natural Titanium",
                "apple-iphone-15-pro-128gb-natural-titanium",
                "SKU-IPH15P-128",
                "A3102",
                "iPhone 15 Pro forged in titanium with the groundbreaking A17 Pro chip, customizable Action button, and a more versatile pro camera system. Includes Super Retina XDR display with ProMotion up to 120Hz.",
                "Titanium design, A17 Pro chip, 48MP main camera, USB-C 3.0 speeds.",
                brandApple, catMobiles,
                127990.0, 134900.0, 24,
                true, true, true, 4.8, 1420,
                "1 Year Apple Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=900",
                        "https://images.unsplash.com/photo-1695048065050-c3d5a2283896?w=900",
                        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900"
                ),
                "{\"Display\":\"6.1-inch Super Retina XDR\",\"Chipset\":\"A17 Pro (3nm)\",\"Camera\":\"48MP + 12MP + 12MP\",\"Battery\":\"Up to 23 hrs video playback\",\"Weight\":\"187 grams\"}"
        );

        createSampleProduct(
                "Sony WH-1000XM5 Wireless Noise Cancelling Headphones",
                "sony-wh-1000xm5-wireless-noise-cancelling-headphones",
                "SKU-SONY-XM5-BLK",
                "WH1000XM5/B",
                "Industry-leading noise cancellation with two processors and 8 microphones. Magnificent sound quality engineered with the new Integrated Processor V1. Crystal clear hands-free calling with 4 beamforming microphones.",
                "Industry Leading ANC, 30hr battery life, Speak-to-chat, Multipoint connection.",
                brandSony, catAudio,
                26990.0, 34990.0, 45,
                true, true, true, 4.7, 3840,
                "1 Year Sony India Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=900",
                        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=900",
                        "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=900"
                ),
                "{\"ANC\":\"Dual Processors & 8 Mics\",\"Driver\":\"30mm Carbon Fiber\",\"Battery Life\":\"30 Hours\",\"Charging\":\"3 min charge = 3 hrs\",\"Weight\":\"250g\"}"
        );

        createSampleProduct(
                "Samsung Galaxy S24 Ultra 5G (Titanium Gray, 256 GB)",
                "samsung-galaxy-s24-ultra-5g-256gb",
                "SKU-SAM-S24U-256",
                "SM-S928B",
                "Meet Galaxy S24 Ultra, the ultimate form of Galaxy Ultra with a new titanium exterior and a 17.25cm flat display. Powered by Galaxy AI, 200MP camera with Quad Telephoto system, and built-in S Pen.",
                "Galaxy AI, Snapdragon 8 Gen 3, 200MP camera, Titanium frame, Built-in S-Pen.",
                brandSamsung, catMobiles,
                119999.0, 134999.0, 18,
                true, true, true, 4.8, 920,
                "1 Year Manufacturer Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=900",
                        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=900"
                ),
                "{\"Screen\":\"6.8 QHD+ Dynamic AMOLED 2X 120Hz\",\"Processor\":\"Snapdragon 8 Gen 3\",\"RAM\":\"12 GB\",\"Storage\":\"256 GB\",\"Battery\":\"5000 mAh\"}"
        );

        createSampleProduct(
                "Apple MacBook Air 15-inch M3 Chip (16GB Unified Memory, 512GB SSD)",
                "apple-macbook-air-15-inch-m3",
                "SKU-MBA15-M3-512",
                "MRYN3HN/A",
                "Supercharged by the M3 chip, the strikingly thin 15-inch MacBook Air lets you blaze through work and play. With up to 18 hours of battery life and a spacious Liquid Retina display, take it anywhere.",
                "Apple M3 chip, 15.3-inch Liquid Retina display, 16GB Unified RAM, 18hr battery.",
                brandApple, catLaptops,
                144900.0, 154900.0, 15,
                true, true, true, 4.9, 560,
                "1 Year Apple Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=900",
                        "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=900"
                ),
                "{\"Processor\":\"Apple M3 (8-core CPU, 10-core GPU)\",\"RAM\":\"16 GB Unified\",\"Storage\":\"512 GB SSD\",\"Display\":\"15.3-inch Liquid Retina\",\"Weight\":\"1.51 kg\"}"
        );

        createSampleProduct(
                "ASUS ROG Zephyrus G16 (2024) OLED Gaming Laptop",
                "asus-rog-zephyrus-g16-oled-2024",
                "SKU-ROG-G16-4070",
                "GU605MI-QR064WS",
                "Precision aluminium CNC chassis packed with Intel Core Ultra 9 processor, NVIDIA GeForce RTX 4070 Laptop GPU, and stunning 2.5K 240Hz ROG Nebula OLED display with G-Sync.",
                "Intel Core Ultra 9, RTX 4070 8GB, 2.5K 240Hz OLED, 32GB LPDDR5X, 1TB SSD.",
                brandAsus, catLaptops,
                189990.0, 219990.0, 12,
                true, false, true, 4.6, 210,
                "2 Years International Warranty + 1 Year ADP", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=900",
                        "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=900"
                ),
                "{\"Display\":\"16-inch 2.5K 240Hz OLED 0.2ms\",\"GPU\":\"RTX 4070 8GB GDDR6\",\"CPU\":\"Intel Core Ultra 9 185H\",\"RAM\":\"32GB\",\"Storage\":\"1TB NVMe PCIe 4.0\"}"
        );

        createSampleProduct(
                "Apple Watch Series 9 GPS 45mm Midnight Aluminium",
                "apple-watch-series-9-gps-45mm",
                "SKU-AW9-45-MID",
                "MR993HN/A",
                "The most powerful chip in Apple Watch ever. A magical new way to use your Apple Watch without touching the screen with Double Tap. A display that's twice as bright. Advanced health insights.",
                "S9 SiP with Double Tap gesture, 2000 nits display, ECG, Blood Oxygen, Crash Detection.",
                brandApple, catWearables,
                41900.0, 44900.0, 30,
                true, true, true, 4.8, 1890,
                "1 Year Apple Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=900",
                        "https://images.unsplash.com/photo-1434494878577-86c23bcb06b9?w=900"
                ),
                "{\"Case Size\":\"45mm Aluminium\",\"Processor\":\"S9 SiP\",\"Sensors\":\"ECG, Blood Oxygen, Temp\",\"Water Resistance\":\"50m swimproof\"}"
        );

        createSampleProduct(
                "Nike Air Zoom Pegasus 40 Men's Road Running Shoes",
                "nike-air-zoom-pegasus-40-running-shoes",
                "SKU-NIKE-PEG40-BLK",
                "DV3853-001",
                "A springy ride for every run, the Peg's familiar, just-for-you feel returns to help you accomplish your goals. This version has the same responsiveness and neutral support you love, with improved comfort.",
                "Nike React technology foam, Dual Zoom Air units, Engineered mesh upper.",
                brandNike, catFootwear,
                8995.0, 11895.0, 50,
                false, true, true, 4.6, 3100,
                "6 Months Brand Warranty", "10 Days Return/Exchange",
                List.of(
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900",
                        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=900"
                ),
                "{\"Material\":\"Engineered Mesh\",\"Cushioning\":\"Nike React + Zoom Air\",\"Weight\":\"288 grams\",\"Type\":\"Road Running\"}"
        );

        createSampleProduct(
                "boAt Airdopes 141 ANC TWS Earbuds (42 Hours Playback)",
                "boat-airdopes-141-anc-tws",
                "SKU-BOAT-AD141-ANC",
                "AD141ANC-BLK",
                "Tune out the world with up to 32dB Active Noise Cancellation. Powered by 10mm drivers delivering signature boAt bass. Beast Mode for 50ms ultra-low latency gaming and ASAP charge.",
                "32dB Active Noise Cancellation, 42 hours playback, ENx Quad Mics, IPX5 water resistance.",
                brandBoat, catAudio,
                1499.0, 3990.0, 100,
                true, true, true, 4.3, 14200,
                "1 Year boAt Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=900",
                        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=900"
                ),
                "{\"Drivers\":\"10mm Dynamic Drivers\",\"ANC\":\"Up to 32dB\",\"Battery\":\"42 Hours Total\",\"Latency\":\"50ms Beast Mode\"}"
        );

        createSampleProduct(
                "Philips Air Fryer HD9252/90 (4.1 Litre, Rapid Air Tech)",
                "philips-air-fryer-hd9252-4-1l",
                "SKU-PHIL-AF-9252",
                "HD9252/90",
                "Healthy frying with Rapid Air technology. Fry with up to 90% less fat. Touch screen with 7 presets for easy cooking of fries, meat, fish, chicken drumsticks, cake and even grilled veggies.",
                "Rapid Air Technology, 90% less fat, Touch screen with 7 presets, Keep warm function.",
                brandPhilips, catHome,
                7499.0, 11995.0, 35,
                false, true, false, 4.5, 4120,
                "2 Years Philips India Warranty", "10 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=900",
                        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=900"
                ),
                "{\"Capacity\":\"4.1 Litres\",\"Power\":\"1400 Watts\",\"Technology\":\"Rapid Air 360\",\"Presets\":\"7 Touch Presets\"}"
        );

        createSampleProduct(
                "Sony Bravia 55-inch 4K Ultra HD Smart LED Google TV",
                "sony-bravia-55-inch-4k-uhd-google-tv",
                "SKU-SONY-55X74L",
                "KD-55X74L",
                "Experience thrilling games and cinematic movies in 4K HDR. The powerful X1 4K processor reduces noise and boosts detail. Clear phase technology delivers natural, smooth sound with punchy bass.",
                "4K Ultra HD (3840 x 2160), X1 4K Processor, Google TV, Dolby Audio, 20W Open Baffle Speaker.",
                brandSony, catElectronics,
                54990.0, 99900.0, 20,
                true, false, true, 4.7, 1850,
                "2 Years Comprehensive Brand Warranty", "10 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=900",
                        "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=900"
                ),
                "{\"Resolution\":\"4K Ultra HD (3840 x 2160)\",\"Refresh Rate\":\"60 Hz\",\"Audio\":\"20 Watts Dolby Audio\",\"OS\":\"Google TV\",\"Ports\":\"3 HDMI, 2 USB\"}"
        );

        // 6. Banners
        bannerRepository.save(new Banner(
                "Amazon Great Indian Festival Sale",
                "Up to 60% OFF on Flagship Smartphones, Laptops & Premium Audio",
                "https://images.unsplash.com/photo-1550009158-9ebf69173e03?w=1600",
                "/products?category=electronics",
                "Explore Deals",
                "Mega Deals",
                1
        ));

        bannerRepository.save(new Banner(
                "Next-Gen 5G Smartphones Festival",
                "Exchange bonus up to ₹10,000 + Instant Bank Discounts with No Cost EMI",
                "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1600",
                "/products?category=smartphones",
                "Shop Smartphones",
                "Top Offers",
                2
        ));

        bannerRepository.save(new Banner(
                "Unbeatable Audio & Noise Cancelling",
                "Hear every note in high fidelity with Sony, Apple, and boAt sound systems",
                "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1600",
                "/products?category=audio-headphones",
                "Discover Audio",
                "Trending",
                3
        ));

        // 7. Coupons
        couponRepository.save(new Coupon(
                "MRK100", "Flat ₹100 OFF on orders above ₹999",
                Coupon.DiscountType.FIXED, 100.0, 999.0, 100.0
        ));

        couponRepository.save(new Coupon(
                "SUPER500", "Flat ₹500 OFF on orders above ₹3,999",
                Coupon.DiscountType.FIXED, 500.0, 3999.0, 500.0
        ));

        couponRepository.save(new Coupon(
                "WELCOME10", "10% OFF for new shoppers (Max ₹1,000)",
                Coupon.DiscountType.PERCENTAGE, 10.0, 500.0, 1000.0
        ));

        couponRepository.save(new Coupon(
                "FESTIVE20", "20% Festive Savings (Max ₹2,500 on ₹5,000+)",
                Coupon.DiscountType.PERCENTAGE, 20.0, 5000.0, 2500.0
        ));

        // 8. Sample Customer Reviews
        List<Product> allProducts = productRepository.findAll();

        if (!allProducts.isEmpty()) {
            Product p1 = allProducts.get(0);

            reviewRepository.save(new Review(
                    p1, null, "Rahul Sharma", 5,
                    "Incredible build quality and outstanding battery!",
                    "Upgraded from my 3 year old phone. The lightweight titanium feel is unmatched. The camera produces breathtaking low-light portraits. Fast delivery to Mumbai in just 1 day!",
                    true
            ));

            reviewRepository.save(new Review(
                    p1, null, "Priya Nair", 5,
                    "Worth every single rupee. Seamless experience.",
                    "Super quick setup, USB-C makes transferring high-res video a breeze. MRK ZONE packed it safely with tamper-proof security seals.",
                    true
            ));
        }

        // Fresh databases create the Smartphones category above; seed after category creation too.
        seedMobileCatalog();
    }


    /**
     * Seeds a starter mobile catalogue up to 100 entries. Existing products are never overwritten.
     * These are editable starter listings; the store admin should verify live pricing and variants.
     */
    private void seedMobileCatalog() {
        Category mobiles = categoryRepository.findBySlug("smartphones").orElse(null);
        if (mobiles == null) return;

        int existingCount = productRepository.findByCategoryIdAndActiveTrue(mobiles.getId()).size();
        if (existingCount >= 100) return;

        String[][] models = {
                {"Apple", "iPhone 16", "69900"},
                {"Apple", "iPhone 16 Pro", "119900"},
                {"Apple", "iPhone 15", "59900"},
                {"Apple", "iPhone 15 Pro", "109900"},
                {"Samsung", "Galaxy S25 5G", "80999"},
                {"Samsung", "Galaxy S24 5G", "62999"},
                {"Samsung", "Galaxy A55 5G", "27999"},
                {"Samsung", "Galaxy A35 5G", "21999"},
                {"OnePlus", "13", "69999"},
                {"OnePlus", "12R", "39999"},
                {"OnePlus", "Nord 4 5G", "29999"},
                {"OnePlus", "Nord CE4 5G", "24999"},
                {"Google", "Pixel 9", "79999"},
                {"Google", "Pixel 8a", "52999"},
                {"Xiaomi", "14", "54999"},
                {"Redmi", "Note 14 Pro 5G", "24999"},
                {"Redmi", "13 5G", "13999"},
                {"Vivo", "V40 5G", "34999"},
                {"Vivo", "V30 5G", "29999"},
                {"OPPO", "Reno12 5G", "32999"},
                {"OPPO", "F27 Pro+ 5G", "27999"},
                {"realme", "GT 6", "39999"},
                {"realme", "Narzo 70 Pro 5G", "18999"},
                {"Motorola", "Edge 50 Pro", "31999"},
                {"Nothing", "Phone (2a)", "23999"}
        };
        String[] capacities = {"128GB", "256GB", "512GB", "1TB"};
        double[] increments = {0, 2500, 6500, 12000};
        String phoneImage = "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=900";
        String secondImage = "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=900";
        int sequence = 1;

        for (String[] model : models) {
            if (existingCount >= 100) break;
            String brandName = model[0];
            String brandSlug = brandName.toLowerCase().replaceAll("[^a-z0-9]+", "-");
            Brand brand = getOrCreateBrand(brandName, brandSlug,
                    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200",
                    "Mobile devices", true);
            double basePrice = Double.parseDouble(model[2]);

            for (int i = 0; i < capacities.length && existingCount < 100; i++) {
                String capacity = capacities[i];
                String title = brandName + " " + model[1] + " (" + capacity + ")";
                String normalized = title.toLowerCase().replaceAll("[^a-z0-9]+", "-").replaceAll("^-|-$", "");
                String sku = "MRK-MOB-" + String.format("%03d", sequence) + "-" + capacity.toUpperCase();
                if (productRepository.findBySku(sku).isEmpty()) {
                    double price = basePrice + increments[i];
                    createSampleProduct(
                            title, normalized, sku, model[1] + "-" + capacity,
                            title + ". Starter catalogue listing. Please verify exact regional specifications, final selling price, warranty and stock before publishing.",
                            "5G smartphone, " + capacity + " storage. Check product details before purchase.",
                            brand, mobiles, price, price * 1.12, 20,
                            false, true, true, 4.4, 0,
                            "As per manufacturer", "7 Days Replacement",
                            List.of(phoneImage, secondImage),
                            "{\"Network\":\"5G\",\"Storage\":\"" + capacity + "\",\"Warranty\":\"As per manufacturer\"}"
                    );
                    existingCount++;
                }
                sequence++;
            }
        }
    }

    // 2. Delivery Zones (Origin: 400072 Mumbai)
    private void seedDeliveryZones() {

        deliveryZoneRepository.findByZoneName("Mumbai Local (Same-Day / Next-Day)")
                .orElseGet(() -> deliveryZoneRepository.save(new DeliveryZone(
                        "Mumbai Local (Same-Day / Next-Day)",
                        "Fast local fulfillment across Mumbai, Thane, Navi Mumbai",
                        "400", 1, 2, 40.0, 99.0, true
                )));

        deliveryZoneRepository.findByZoneName("Maharashtra & Western Zone")
                .orElseGet(() -> deliveryZoneRepository.save(new DeliveryZone(
                        "Maharashtra & Western Zone",
                        "Pune, Nashik, Nagpur, Aurangabad, Goa",
                        "401,402,403,410,411,412,413,414,415,416,42",
                        2, 3, 50.0, 119.0, true
                )));

        deliveryZoneRepository.findByZoneName("Delhi NCR & North Metro")
                .orElseGet(() -> deliveryZoneRepository.save(new DeliveryZone(
                        "Delhi NCR & North Metro",
                        "New Delhi, Gurgaon, Noida, Ghaziabad, Faridabad",
                        "110,120,121,122,201",
                        2, 4, 60.0, 129.0, true
                )));

        deliveryZoneRepository.findByZoneName("South Metro (Bengaluru, Hyderabad, Chennai)")
                .orElseGet(() -> deliveryZoneRepository.save(new DeliveryZone(
                        "South Metro (Bengaluru, Hyderabad, Chennai)",
                        "Karnataka, Telangana, Tamil Nadu Metros",
                        "560,500,600",
                        2, 4, 60.0, 129.0, true
                )));

        deliveryZoneRepository.findByZoneName("Rest of India")
                .orElseGet(() -> deliveryZoneRepository.save(new DeliveryZone(
                        "Rest of India",
                        "Pan India Standard Delivery Coverage",
                        "1,2,3,5,6,7,8",
                        3, 5, 70.0, 149.0, false
                )));
    }

    private void createSampleProduct(String title, String slug, String sku, String model,
                                     String desc, String shortDesc, Brand brand, Category cat,
                                     Double price, Double mrp, Integer stock,
                                     boolean featured, boolean bestSeller, boolean trending,
                                     Double rating, Integer reviews, String warranty, String retPolicy,
                                     List<String> images, String specsJson) {

        if (productRepository.findBySku(sku).isPresent()) {
            return;
        }

        Product p = new Product();
        p.setTitle(title);
        p.setSlug(slug);
        p.setSku(sku);
        p.setModelNumber(model);
        p.setDescription(desc);
        p.setShortDescription(shortDesc);
        p.setBrand(brand);
        p.setCategory(cat);
        p.setPrice(price);
        p.setMrp(mrp);
        p.setStockQuantity(stock);
        p.setInStock(stock > 0);
        p.setFeatured(featured);
        p.setBestSeller(bestSeller);
        p.setTrending(trending);
        p.setRating(rating);
        p.setReviewCount(reviews);
        p.setWarrantyPeriod(warranty);
        p.setReturnPolicy(retPolicy);
        p.setSpecsJson(specsJson);
        p.setOffersJson("[{\"title\":\"Bank Offer\",\"desc\":\"Instant 10% discount on HDFC & ICICI Credit Cards up to ₹1,500\"},{\"title\":\"No Cost EMI\",\"desc\":\"Up to 6 months No Cost EMI on leading credit cards\"},{\"title\":\"Partner Offer\",\"desc\":\"Get GST invoice and save up to 18% on business purchases\"}]");

        Product saved = productRepository.save(p);

        int order = 0;

        for (String url : images) {
            ProductImage img = new ProductImage(saved, url, order == 0, order);
            productImageRepository.save(img);
            saved.getImages().add(img);
            order++;
        }

        productRepository.save(saved);
    }

    /**
     * Reuses an existing brand by slug or name before creating a new row.
     * This makes startup safe when the database already contains catalog data.
     */
    private Brand getOrCreateBrand(String name, String slug, String logoUrl,
                                   String description, boolean featured) {
        return brandRepository.findBySlug(slug)
                .or(() -> brandRepository.findByNameIgnoreCase(name))
                .orElseGet(() -> brandRepository.save(
                        new Brand(name, slug, logoUrl, description, featured)
                ));
    }

    private void seedAdditionalAmazonCatalog() {

        if (productRepository.findBySku("SKU-AMZ-FIRETV4K").isPresent()) {
            return;
        }

        Brand brandAmazon = getOrCreateBrand(
                "Amazon", "amazon",
                "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg",
                "Everyday Essentials & Smart Tech", true
        );

        Brand brandSamsung = getOrCreateBrand(
                "Samsung", "samsung",
                "https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg",
                "Do what you can't", true
        );

        Brand brandNike = getOrCreateBrand(
                "Nike", "nike",
                "https://upload.wikimedia.org/wikipedia/commons/a/a6/Logo_NIKE.svg",
                "Just Do It", true
        );

        Category catElectronics = categoryRepository.findBySlug("electronics").orElse(null);
        Category catMobiles = categoryRepository.findBySlug("smartphones").orElse(null);
        Category catLaptops = categoryRepository.findBySlug("laptops-computers").orElse(null);
        Category catHome = categoryRepository.findBySlug("home-kitchen").orElse(null);
        Category catFashion = categoryRepository.findBySlug("fashion").orElse(null);
        Category catFootwear = categoryRepository.findBySlug("footwear").orElse(null);

        if (catElectronics == null || catHome == null) return;

        createSampleProduct(
                "Amazon Fire TV Stick 4K with Alexa Voice Remote (Dolby Vision)",
                "amazon-fire-tv-stick-4k-alexa-voice-remote",
                "SKU-AMZ-FIRETV4K",
                "B0BP9MDCQZ",
                "Cinematic 4K streaming with support for Dolby Vision, HDR10+, and immersive Dolby Atmos audio. Next-gen streaming with Wi-Fi 6 support and Alexa Voice Remote.",
                "4K Ultra HD streaming, Dolby Vision, Wi-Fi 6 support, Alexa Voice Remote.",
                brandAmazon, catElectronics,
                3999.0, 5999.0, 80,
                true, true, true, 4.6, 8940,
                "1 Year Amazon Device Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=900",
                        "https://images.unsplash.com/photo-1518770660439-4636190af475?w=900"
                ),
                "{\"Resolution\":\"4K Ultra HD up to 60fps\",\"Audio\":\"Dolby Atmos\",\"Connectivity\":\"Wi-Fi 6, Bluetooth 5.2\",\"Voice Remote\":\"Included with TV controls\"}"
        );

        createSampleProduct(
                "Amazon Echo Dot (5th Gen) Smart Speaker with Alexa (Deeper Bass)",
                "amazon-echo-dot-5th-gen-smart-speaker-alexa",
                "SKU-AMZ-ECHODOT5",
                "B09B8V1LZ3",
                "Our best-sounding Echo Dot yet: enjoy improved audio experience with clearer vocals, deeper bass, and vibrant sound in any room. Control smart lights, play music with Alexa.",
                "Improved vibrant sound, Motion detection, Alexa built-in, Bluetooth speaker.",
                brandAmazon, catElectronics,
                4499.0, 5499.0, 65,
                true, true, true, 4.5, 12500,
                "1 Year Amazon Device Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1543512214-318c7553f230?w=900",
                        "https://images.unsplash.com/photo-1507646227500-4d389b0012be?w=900"
                ),
                "{\"Audio\":\"1.73-inch front-firing speaker\",\"Connectivity\":\"Dual-band Wi-Fi, Bluetooth\",\"Voice\":\"Hands-free Alexa\",\"Privacy\":\"Mic off button\"}"
        );

        createSampleProduct(
                "Logitech MK295 Silent Wireless Keyboard and Mouse Combo",
                "logitech-mk295-silent-wireless-keyboard-mouse",
                "SKU-LOGI-MK295",
                "MK295-BLK",
                "SilentTouch technology reduces over 90% of typing and clicking noise. Full-size keyboard with 8 handy shortcuts and durable spill-resistant design. Reliable 2.4 GHz wireless.",
                "SilentTouch Tech, 90% less click noise, 36-month keyboard battery life, Spill-resistant.",
                brandAmazon, catLaptops,
                1995.0, 2995.0, 50,
                true, false, true, 4.4, 6200,
                "3 Years Manufacturer Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900",
                        "https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=900"
                ),
                "{\"Wireless Range\":\"10 meters\",\"Battery\":\"36M Keyboard, 18M Mouse\",\"Silent Click\":\"Yes (90% reduction)\",\"Keys\":\"Full-size with numpad\"}"
        );

        createSampleProduct(
                "Samsung 25W Type-C Super Fast Power Adapter Charger (White)",
                "samsung-25w-type-c-fast-charger",
                "SKU-SAM-25W-WHT",
                "EP-TA800NBEGIN",
                "Give your mobile devices the powerful and safe charging support they deserve. Super Fast Charging up to 25W with compatible devices. USB Type-C interface.",
                "Super Fast Charging 25W, PD 3.0, Compact travel-ready design, Over-voltage protection.",
                brandSamsung, catMobiles,
                999.0, 1699.0, 120,
                false, true, true, 4.6, 18400,
                "6 Months Brand Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=900"
                ),
                "{\"Max Output\":\"25W\",\"Port\":\"USB Type-C\",\"Input\":\"100-240V AC\",\"Protocol\":\"PD 3.0 PPS\"}"
        );

        createSampleProduct(
                "Titan Contemporary Vintage Silent Sweep Wall Clock for Home",
                "titan-contemporary-vintage-silent-wall-clock",
                "SKU-TITAN-CLK-01",
                "W0004EA01",
                "Enhance your living room and bedroom walls with this elegant vintage round wall clock from Titan. Features silent sweep quartz movement for a peaceful, tick-free environment.",
                "Silent sweep quartz mechanism, Scratch-resistant glass, Elegant modern frame.",
                brandAmazon, catHome,
                1295.0, 2195.0, 40,
                false, true, false, 4.5, 2950,
                "1 Year Brand Warranty", "10 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=900"
                ),
                "{\"Diameter\":\"30 cm\",\"Movement\":\"Silent Sweep Quartz\",\"Power\":\"1 AA Battery\",\"Material\":\"High-grade Plastic & Glass\"}"
        );

        createSampleProduct(
                "Anouk Women's Floral Printed Pure Cotton A-Line Kurta & Palazzo Set",
                "anouk-womens-floral-cotton-kurta-palazzo-set",
                "SKU-ANOUK-KURTA-01",
                "AK-KURTA-01",
                "Step out in vibrant ethnic elegance with this pure cotton floral printed kurta set. Includes a mandarin collar, three-quarter sleeves, flared hem, and matching printed palazzo.",
                "100% Breathable Cotton, Fast color print, Flared hemline with elasticated palazzo.",
                brandAmazon, catFashion,
                799.0, 2499.0, 75,
                false, true, true, 4.3, 3400,
                "Brand Quality Guarantee", "14 Days Easy Returns",
                List.of(
                        "https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=900"
                ),
                "{\"Fabric\":\"100% Cotton\",\"Sleeve Length\":\"Three-Quarter Sleeves\",\"Pattern\":\"Floral Printed\",\"Wash Care\":\"Machine Wash\"}"
        );

        createSampleProduct(
                "Prestige Iris 750 Watt Mixer Grinder with 4 Stainless Steel Jars",
                "prestige-iris-750-watt-mixer-grinder",
                "SKU-PREST-IRIS-750",
                "IRIS-750W",
                "Heavy-duty 750-watt copper winding motor for effortless grinding of tough ingredients. Comes with 3 stainless steel jars for wet, dry, and chutney grinding plus a juicer jar.",
                "750W powerful motor, 4 multi-utility jars with safety lock, Ergonomic design handles.",
                brandAmazon, catHome,
                2999.0, 6195.0, 30,
                true, true, false, 4.4, 8200,
                "2 Years Prestige India Warranty", "10 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=900"
                ),
                "{\"Wattage\":\"750 Watts\",\"Jars\":\"4 (Wet, Dry, Chutney, Juicer)\",\"Blades\":\"High Grade Stainless Steel\",\"Speed\":\"3 Speed with Pulse\"}"
        );

        createSampleProduct(
                "Happilo 100% Natural Premium California Whole Almonds (500g Value Pack)",
                "happilo-natural-california-almonds-500g",
                "SKU-HAPP-ALMOND-500",
                "HAPP-ALM-500",
                "Happilo premium California whole almonds are 100% natural, rich in protein, dietary fiber, vitamin E, and healthy fats. Vacuum sealed to ensure maximum freshness and crispness.",
                "100% Natural raw almonds, Zero cholesterol, High in protein and antioxidants.",
                brandAmazon, catHome,
                449.0, 625.0, 150,
                false, true, true, 4.7, 19200,
                "FSSAI Certified Freshness", "7 Days Return",
                List.of(
                        "https://images.unsplash.com/photo-1508061252445-5350f3ab0a55?w=900"
                ),
                "{\"Net Weight\":\"500g\",\"Form\":\"Whole Nuts\",\"Diet Type\":\"Vegetarian, Gluten Free\",\"Shelf Life\":\"12 Months\"}"
        );

        createSampleProduct(
                "Puma Men's Smash v2 Classic Leather Sneakers (White & Black)",
                "puma-mens-smash-v2-leather-sneakers",
                "SKU-PUMA-SMASH-V2",
                "36521501",
                "The Puma Smash v2 is the new interpretation of the Smash icon. The tennis-inspired silhouette features a soft leather upper with an improved fit. SoftFoam+ sockliner for optimal comfort.",
                "Soft leather upper, Durable rubber outsole, SoftFoam+ cushioned footbed.",
                brandNike, catFootwear,
                2499.0, 4499.0, 60,
                true, true, true, 4.4, 5100,
                "3 Months Puma Warranty", "10 Days Return/Exchange",
                List.of(
                        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900"
                ),
                "{\"Upper Material\":\"Leather & Synthetic\",\"Sole\":\"Rubber\",\"Closure\":\"Lace-Up\",\"Occasion\":\"Casual / Lifestyle\"}"
        );

        createSampleProduct(
                "Oral-B CrossAction Battery Powered Deep Clean Electric Toothbrush",
                "oral-b-crossaction-electric-toothbrush",
                "SKU-ORALB-CA-ELEC",
                "OB-CA-BAT",
                "Rotating PowerHead loosens and whisks away plaque from surfaces, gumline and back teeth. CrissCross bristles reach deep between teeth to lift out and sweep away plaque.",
                "Rotating PowerHead, CrissCross bristles, Replaceable battery powered, Soft gum care.",
                brandAmazon, catHome,
                399.0, 799.0, 90,
                false, true, true, 4.3, 7600,
                "1 Year Brand Warranty", "7 Days Replacement",
                List.of(
                        "https://images.unsplash.com/photo-1559591937-e62057200a40?w=900"
                ),
                "{\"Power\":\"1 AA Battery (included)\",\"Bristles\":\"Soft CrissCross\",\"Movement\":\"Dual action rotating head\"}"
        );
    }
}