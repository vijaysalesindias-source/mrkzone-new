package com.mrkzone.repository;

import com.mrkzone.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByProductIdAndStatusOrderByCreatedAtDesc(Long productId, Review.ReviewStatus status);
    List<Review> findByUserIdOrderByCreatedAtDesc(Long userId);
    List<Review> findAllByOrderByCreatedAtDesc();

    long countByProductIdAndStatus(Long productId, Review.ReviewStatus status);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.status = 'APPROVED'")
    Double getAverageRatingForProduct(@Param("productId") Long productId);
}
