package com.mrkzone.service;

import com.mrkzone.dto.ReviewRequest;
import com.mrkzone.exception.ResourceNotFoundException;
import com.mrkzone.model.Product;
import com.mrkzone.model.Review;
import com.mrkzone.model.User;
import com.mrkzone.repository.ProductRepository;
import com.mrkzone.repository.ReviewRepository;
import com.mrkzone.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository,
                         ProductRepository productRepository,
                         UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
    }

    public List<Review> getApprovedReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdAndStatusOrderByCreatedAtDesc(productId, Review.ReviewStatus.APPROVED);
    }

    @Transactional
    public Review addReview(ReviewRequest request, Long userId) {
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", request.getProductId()));

        User user = null;
        String reviewerName = request.getReviewerName();
        if (userId != null) {
            user = userRepository.findById(userId).orElse(null);
            if (user != null && (reviewerName == null || reviewerName.isBlank())) {
                reviewerName = user.getFullName();
            }
        }
        if (reviewerName == null || reviewerName.isBlank()) {
            reviewerName = "Verified Customer";
        }

        Review review = new Review();
        review.setProduct(product);
        review.setUser(user);
        review.setReviewerName(reviewerName);
        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());
        review.setVerifiedPurchase(true);
        review.setStatus(Review.ReviewStatus.APPROVED);

        Review saved = reviewRepository.save(review);

        // Recalculate product rating and review count
        long count = reviewRepository.countByProductIdAndStatus(product.getId(), Review.ReviewStatus.APPROVED);
        Double avg = reviewRepository.getAverageRatingForProduct(product.getId());

        product.setReviewCount((int) count);
        if (avg != null) {
            product.setRating(Math.round(avg * 10.0) / 10.0);
        }
        productRepository.save(product);

        return saved;
    }

    @Transactional
    public Review markHelpful(Long reviewId) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", reviewId));
        review.setHelpfulCount(review.getHelpfulCount() + 1);
        return reviewRepository.save(review);
    }

    public List<Review> getAllReviews() {
        return reviewRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public void deleteReview(Long reviewId) {
        reviewRepository.deleteById(reviewId);
    }
}
