package com.mrkzone.service;

import com.mrkzone.exception.ResourceNotFoundException;
import com.mrkzone.model.Product;
import com.mrkzone.model.User;
import com.mrkzone.model.Wishlist;
import com.mrkzone.model.WishlistItem;
import com.mrkzone.repository.ProductRepository;
import com.mrkzone.repository.UserRepository;
import com.mrkzone.repository.WishlistItemRepository;
import com.mrkzone.repository.WishlistRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class WishlistService {

    private final WishlistRepository wishlistRepository;
    private final WishlistItemRepository wishlistItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public WishlistService(WishlistRepository wishlistRepository,
                           WishlistItemRepository wishlistItemRepository,
                           ProductRepository productRepository,
                           UserRepository userRepository) {
        this.wishlistRepository = wishlistRepository;
        this.wishlistItemRepository = wishlistItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId)
                .orElseGet(() -> {
                    User user = userRepository.findById(userId)
                            .orElseThrow(() -> new ResourceNotFoundException("User", "id", userId));
                    return wishlistRepository.save(new Wishlist(user));
                });
    }

    @Transactional
    public Wishlist toggleWishlistItem(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));

        Optional<WishlistItem> existing = wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId);

        if (existing.isPresent()) {
            wishlist.getItems().remove(existing.get());
            wishlistItemRepository.delete(existing.get());
        } else {
            WishlistItem item = new WishlistItem(wishlist, product);
            wishlist.getItems().add(item);
            wishlistItemRepository.save(item);
        }

        return wishlistRepository.save(wishlist);
    }

    @Transactional
    public Wishlist removeItem(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Optional<WishlistItem> existing = wishlistItemRepository.findByWishlistIdAndProductId(wishlist.getId(), productId);
        existing.ifPresent(item -> {
            wishlist.getItems().remove(item);
            wishlistItemRepository.delete(item);
        });
        return wishlist;
    }
}
