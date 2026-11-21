package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.dto.ReviewRequest;
import com.mrkzone.model.Review;
import com.mrkzone.security.UserPrincipal;
import com.mrkzone.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<Review>>> getProductReviews(@PathVariable Long productId) {
        List<Review> reviews = reviewService.getApprovedReviewsForProduct(productId);
        return ResponseEntity.ok(ApiResponse.success("Reviews", reviews));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Review>> addReview(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody ReviewRequest request) {
        Long userId = (principal != null) ? principal.getId() : null;
        Review review = reviewService.addReview(request, userId);
        return ResponseEntity.ok(ApiResponse.success("Review submitted successfully", review));
    }

    @PostMapping("/{id}/helpful")
    public ResponseEntity<ApiResponse<Review>> markHelpful(@PathVariable Long id) {
        Review review = reviewService.markHelpful(id);
        return ResponseEntity.ok(ApiResponse.success("Helpful count updated", review));
    }
}
