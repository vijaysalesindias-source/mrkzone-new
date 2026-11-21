package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.model.Brand;
import com.mrkzone.service.BrandService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/brands")
public class BrandController {

    private final BrandService brandService;

    public BrandController(BrandService brandService) {
        this.brandService = brandService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Brand>>> getBrands() {
        return ResponseEntity.ok(ApiResponse.success("Brands", brandService.getAllActiveBrands()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Brand>> getBrandBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success("Brand", brandService.getBrandBySlug(slug)));
    }
}
