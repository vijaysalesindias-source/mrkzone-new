package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.model.Category;
import com.mrkzone.service.CategoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Category>>> getCategories() {
        return ResponseEntity.ok(ApiResponse.success("Categories", categoryService.getAllActiveCategories()));
    }

    @GetMapping("/{slug}")
    public ResponseEntity<ApiResponse<Category>> getCategoryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success("Category", categoryService.getCategoryBySlug(slug)));
    }
}
