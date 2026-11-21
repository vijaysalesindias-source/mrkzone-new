package com.mrkzone.repository;

import com.mrkzone.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findBySlug(String slug);
    Optional<Product> findBySku(String sku);

    List<Product> findByFeaturedTrueAndActiveTrue();
    List<Product> findByBestSellerTrueAndActiveTrue();
    List<Product> findByTrendingTrueAndActiveTrue();

    List<Product> findByCategoryIdAndActiveTrue(Long categoryId);
    List<Product> findByBrandIdAndActiveTrue(Long brandId);

    @Query("SELECT p FROM Product p WHERE p.active = true AND " +
           "(:keyword IS NULL OR LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.brand.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.category.name) LIKE LOWER(CONCAT('%', :keyword, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId) AND " +
           "(:brandId IS NULL OR p.brand.id = :brandId) AND " +
           "(:minPrice IS NULL OR p.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR p.price <= :maxPrice) AND " +
           "(:minRating IS NULL OR p.rating >= :minRating) AND " +
           "(:inStockOnly IS NULL OR :inStockOnly = false OR p.stockQuantity > 0)")
    Page<Product> searchProducts(
            @Param("keyword") String keyword,
            @Param("categoryId") Long categoryId,
            @Param("brandId") Long brandId,
            @Param("minPrice") Double minPrice,
            @Param("maxPrice") Double maxPrice,
            @Param("minRating") Double minRating,
            @Param("inStockOnly") Boolean inStockOnly,
            Pageable pageable
    );

    @Query("SELECT p.title FROM Product p WHERE p.active = true AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.description) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.brand.name) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
           " LOWER(p.category.name) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    List<String> findSearchSuggestions(@Param("keyword") String keyword, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.category.id = :categoryId AND p.id <> :excludeProductId")
    List<Product> findSimilarProducts(@Param("categoryId") Long categoryId, @Param("excludeProductId") Long excludeProductId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true AND p.id <> :excludeProductId ORDER BY p.rating DESC, p.reviewCount DESC")
    List<Product> findFallbackSimilarProducts(@Param("excludeProductId") Long excludeProductId, Pageable pageable);

    @Query("SELECT p FROM Product p WHERE p.active = true ORDER BY p.reviewCount DESC")
    List<Product> findFrequentlyBoughtTogether(Pageable pageable);
}
