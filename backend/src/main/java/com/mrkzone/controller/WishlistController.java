package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.model.Wishlist;
import com.mrkzone.security.UserPrincipal;
import com.mrkzone.service.WishlistService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    private final WishlistService wishlistService;

    public WishlistController(WishlistService wishlistService) {
        this.wishlistService = wishlistService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Wishlist>> getWishlist(@AuthenticationPrincipal UserPrincipal principal) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        Wishlist wishlist = wishlistService.getOrCreateWishlist(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Wishlist retrieved", wishlist));
    }

    @PostMapping("/toggle/{productId}")
    public ResponseEntity<ApiResponse<Wishlist>> toggleItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        Wishlist wishlist = wishlistService.toggleWishlistItem(principal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Wishlist updated", wishlist));
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<ApiResponse<Wishlist>> removeItem(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long productId) {
        if (principal == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Unauthorized"));
        }
        Wishlist wishlist = wishlistService.removeItem(principal.getId(), productId);
        return ResponseEntity.ok(ApiResponse.success("Item removed from wishlist", wishlist));
    }
}
