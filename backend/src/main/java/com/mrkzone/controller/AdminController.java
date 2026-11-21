package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.dto.DashboardStatsDto;
import com.mrkzone.dto.OrderStatusUpdateRequest;
import com.mrkzone.model.*;
import com.mrkzone.service.*;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
public class AdminController {

    private final AdminService adminService;
    private final ProductService productService;
    private final OrderService orderService;
    private final CategoryService categoryService;
    private final BrandService brandService;
    private final ReviewService reviewService;

    public AdminController(AdminService adminService,
                           ProductService productService,
                           OrderService orderService,
                           CategoryService categoryService,
                           BrandService brandService,
                           ReviewService reviewService) {
        this.adminService = adminService;
        this.productService = productService;
        this.orderService = orderService;
        this.categoryService = categoryService;
        this.brandService = brandService;
        this.reviewService = reviewService;
    }

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<DashboardStatsDto>> getStats() {
        return ResponseEntity.ok(ApiResponse.success("Dashboard statistics", adminService.getDashboardStats()));
    }

    // Orders
    @GetMapping("/orders")
    public ResponseEntity<ApiResponse<List<Order>>> getOrders() {
        return ResponseEntity.ok(ApiResponse.success("All orders", orderService.getAllOrders()));
    }

    @PutMapping("/orders/{orderNumber}/status")
    public ResponseEntity<ApiResponse<Order>> updateOrderStatus(
            @PathVariable String orderNumber,
            @Valid @RequestBody OrderStatusUpdateRequest request) {
        Order updated = orderService.updateOrderStatus(orderNumber, request);
        return ResponseEntity.ok(ApiResponse.success("Order status updated", updated));
    }

    @PostMapping("/orders/{orderId}/refund")
    public ResponseEntity<ApiResponse<Refund>> processRefund(
            @PathVariable Long orderId,
            @RequestBody Map<String, String> body) {
        String reason = body.getOrDefault("reason", "Customer requested refund");
        Refund refund = adminService.processRefund(orderId, reason);
        return ResponseEntity.ok(ApiResponse.success("Refund processed successfully", refund));
    }

    // Products
    @PostMapping("/products")
    public ResponseEntity<ApiResponse<Product>> createProduct(
            @RequestBody Map<String, Object> body) {
        Product p = new Product();
        p.setTitle((String) body.get("title"));
        p.setSlug((String) body.get("slug"));
        p.setSku((String) body.get("sku"));
        p.setModelNumber((String) body.get("modelNumber"));
        p.setDescription((String) body.get("description"));
        p.setShortDescription((String) body.get("shortDescription"));
        p.setPrice(Double.valueOf(body.get("price").toString()));
        p.setMrp(Double.valueOf(body.get("mrp").toString()));
        p.setStockQuantity(Integer.valueOf(body.get("stockQuantity").toString()));
        p.setFeatured(Boolean.TRUE.equals(body.get("featured")));
        p.setBestSeller(Boolean.TRUE.equals(body.get("bestSeller")));
        p.setTrending(Boolean.TRUE.equals(body.get("trending")));
        p.setWarrantyPeriod((String) body.get("warrantyPeriod"));
        p.setReturnPolicy((String) body.get("returnPolicy"));
        p.setSpecsJson((String) body.get("specsJson"));
        p.setVideoUrl((String) body.get("videoUrl"));

        Long catId = Long.valueOf(body.get("categoryId").toString());
        Long brandId = Long.valueOf(body.get("brandId").toString());
        @SuppressWarnings("unchecked")
        List<String> imageUrls = (List<String>) body.get("imageUrls");

        Product created = productService.createProduct(p, catId, brandId, imageUrls);
        return ResponseEntity.ok(ApiResponse.success("Product created successfully", created));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Product>> updateProduct(
            @PathVariable Long id,
            @RequestBody Map<String, Object> body) {
        Product p = new Product();
        p.setTitle((String) body.get("title"));
        p.setDescription((String) body.get("description"));
        p.setShortDescription((String) body.get("shortDescription"));
        p.setPrice(Double.valueOf(body.get("price").toString()));
        p.setMrp(Double.valueOf(body.get("mrp").toString()));
        p.setStockQuantity(Integer.valueOf(body.get("stockQuantity").toString()));
        p.setSku((String) body.get("sku"));
        p.setModelNumber((String) body.get("modelNumber"));
        p.setWarrantyPeriod((String) body.get("warrantyPeriod"));
        p.setReturnPolicy((String) body.get("returnPolicy"));
        p.setFeatured(Boolean.TRUE.equals(body.get("featured")));
        p.setBestSeller(Boolean.TRUE.equals(body.get("bestSeller")));
        p.setTrending(Boolean.TRUE.equals(body.get("trending")));
        p.setSpecsJson((String) body.get("specsJson"));
        p.setVideoUrl((String) body.get("videoUrl"));
        p.setActive(!Boolean.FALSE.equals(body.get("active")));

        Long catId = body.get("categoryId") != null ? Long.valueOf(body.get("categoryId").toString()) : null;
        Long brandId = body.get("brandId") != null ? Long.valueOf(body.get("brandId").toString()) : null;
        @SuppressWarnings("unchecked")
        List<String> imageUrls = (List<String>) body.get("imageUrls");

        Product updated = productService.updateProduct(id, p, catId, brandId, imageUrls);
        return ResponseEntity.ok(ApiResponse.success("Product updated successfully", updated));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success("Product deleted successfully"));
    }

    // Customers
    @GetMapping("/customers")
    public ResponseEntity<ApiResponse<List<User>>> getCustomers() {
        return ResponseEntity.ok(ApiResponse.success("Customers", adminService.getAllCustomers()));
    }

    @PutMapping("/customers/{id}/toggle-status")
    public ResponseEntity<ApiResponse<User>> toggleCustomerStatus(@PathVariable Long id) {
        User user = adminService.toggleUserStatus(id);
        return ResponseEntity.ok(ApiResponse.success("Customer status toggled", user));
    }

    // Coupons
    @GetMapping("/coupons")
    public ResponseEntity<ApiResponse<List<Coupon>>> getCoupons() {
        return ResponseEntity.ok(ApiResponse.success("Coupons", adminService.getAllCoupons()));
    }

    @PostMapping("/coupons")
    public ResponseEntity<ApiResponse<Coupon>> createCoupon(@RequestBody Coupon coupon) {
        Coupon saved = adminService.createCoupon(coupon);
        return ResponseEntity.ok(ApiResponse.success("Coupon created", saved));
    }

    @DeleteMapping("/coupons/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCoupon(@PathVariable Long id) {
        adminService.deleteCoupon(id);
        return ResponseEntity.ok(ApiResponse.success("Coupon deleted"));
    }

    // Banners
    @GetMapping("/banners")
    public ResponseEntity<ApiResponse<List<Banner>>> getBanners() {
        return ResponseEntity.ok(ApiResponse.success("Banners", adminService.getAllBanners()));
    }

    @PostMapping("/banners")
    public ResponseEntity<ApiResponse<Banner>> createBanner(@RequestBody Banner banner) {
        Banner saved = adminService.createBanner(banner);
        return ResponseEntity.ok(ApiResponse.success("Banner created", saved));
    }

    @PutMapping("/banners/{id}")
    public ResponseEntity<ApiResponse<Banner>> updateBanner(@PathVariable Long id, @RequestBody Banner banner) {
        Banner updated = adminService.updateBanner(id, banner);
        return ResponseEntity.ok(ApiResponse.success("Banner updated", updated));
    }

    @DeleteMapping("/banners/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBanner(@PathVariable Long id) {
        adminService.deleteBanner(id);
        return ResponseEntity.ok(ApiResponse.success("Banner deleted"));
    }

    // Categories
    @PostMapping("/categories")
    public ResponseEntity<ApiResponse<Category>> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(ApiResponse.success("Category created", categoryService.createCategory(category)));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Category>> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return ResponseEntity.ok(ApiResponse.success("Category updated", categoryService.updateCategory(id, category)));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.ok(ApiResponse.success("Category deleted"));
    }

    // Brands
    @PostMapping("/brands")
    public ResponseEntity<ApiResponse<Brand>> createBrand(@RequestBody Brand brand) {
        return ResponseEntity.ok(ApiResponse.success("Brand created", brandService.createBrand(brand)));
    }

    @PutMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<Brand>> updateBrand(@PathVariable Long id, @RequestBody Brand brand) {
        return ResponseEntity.ok(ApiResponse.success("Brand updated", brandService.updateBrand(id, brand)));
    }

    @DeleteMapping("/brands/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBrand(@PathVariable Long id) {
        brandService.deleteBrand(id);
        return ResponseEntity.ok(ApiResponse.success("Brand deleted"));
    }

    // Reviews moderation
    @GetMapping("/reviews")
    public ResponseEntity<ApiResponse<List<Review>>> getReviews() {
        return ResponseEntity.ok(ApiResponse.success("All reviews", reviewService.getAllReviews()));
    }

    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
        return ResponseEntity.ok(ApiResponse.success("Review deleted"));
    }
}
