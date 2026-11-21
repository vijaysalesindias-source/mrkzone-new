package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.model.Product;
import com.mrkzone.service.ProductService;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Page<Product>>> getProducts(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Double minPrice,
            @RequestParam(required = false) Double maxPrice,
            @RequestParam(required = false) Double minRating,
            @RequestParam(required = false) Boolean inStockOnly,
            @RequestParam(defaultValue = "relevance") String sortBy,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "16") int size) {

        Page<Product> products = productService.searchProducts(
                keyword, categoryId, brandId, minPrice, maxPrice, minRating, inStockOnly, sortBy, page, size
        );
        return ResponseEntity.ok(ApiResponse.success("Products fetched", products));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<String>>> getSearchSuggestions(@RequestParam String q) {
        List<String> suggestions = productService.getSearchSuggestions(q);
        return ResponseEntity.ok(ApiResponse.success("Suggestions", suggestions));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Product>> getProductById(@PathVariable Long id) {
        Product product = productService.getProductById(id);
        return ResponseEntity.ok(ApiResponse.success("Product found", product));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<ApiResponse<Product>> getProductBySlug(@PathVariable String slug) {
        Product product = productService.getProductBySlug(slug);
        return ResponseEntity.ok(ApiResponse.success("Product found", product));
    }

    @GetMapping("/featured")
    public ResponseEntity<ApiResponse<List<Product>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.success("Featured products", productService.getFeaturedProducts()));
    }

    @GetMapping("/best-sellers")
    public ResponseEntity<ApiResponse<List<Product>>> getBestSellers() {
        return ResponseEntity.ok(ApiResponse.success("Best seller products", productService.getBestSellers()));
    }

    @GetMapping("/trending")
    public ResponseEntity<ApiResponse<List<Product>>> getTrendingProducts() {
        return ResponseEntity.ok(ApiResponse.success("Trending products", productService.getTrendingProducts()));
    }

    @GetMapping("/{id}/similar")
    public ResponseEntity<ApiResponse<List<Product>>> getSimilarProducts(@PathVariable Long id, @RequestParam Long categoryId) {
        return ResponseEntity.ok(ApiResponse.success("Similar products", productService.getSimilarProducts(categoryId, id)));
    }

    @GetMapping("/frequently-bought-together")
    public ResponseEntity<ApiResponse<List<Product>>> getFrequentlyBoughtTogether() {
        return ResponseEntity.ok(ApiResponse.success("Frequently bought together", productService.getFrequentlyBoughtTogether()));
    }
}
