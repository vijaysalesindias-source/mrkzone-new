package com.mrkzone.service;

import com.mrkzone.exception.ResourceNotFoundException;
import com.mrkzone.model.Brand;
import com.mrkzone.model.Category;
import com.mrkzone.model.Product;
import com.mrkzone.model.ProductImage;
import com.mrkzone.repository.BrandRepository;
import com.mrkzone.repository.CategoryRepository;
import com.mrkzone.repository.ProductImageRepository;
import com.mrkzone.repository.ProductRepository;
import com.mrkzone.repository.ReviewRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;
    private final ProductImageRepository productImageRepository;
    private final ReviewRepository reviewRepository;

    public ProductService(ProductRepository productRepository,
                          CategoryRepository categoryRepository,
                          BrandRepository brandRepository,
                          ProductImageRepository productImageRepository,
                          ReviewRepository reviewRepository) {
        this.productRepository = productRepository;
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
        this.productImageRepository = productImageRepository;
        this.reviewRepository = reviewRepository;
    }

    public Page<Product> searchProducts(String keyword,
                                       Long categoryId,
                                       Long brandId,
                                       Double minPrice,
                                       Double maxPrice,
                                       Double minRating,
                                       Boolean inStockOnly,
                                       String sortBy,
                                       int page,
                                       int size) {
        Sort sort;
        if ("price_asc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("price").ascending();
        } else if ("price_desc".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("price").descending();
        } else if ("rating".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("rating").descending();
        } else if ("newest".equalsIgnoreCase(sortBy)) {
            sort = Sort.by("createdAt").descending();
        } else {
            sort = Sort.by("bestSeller").descending().and(Sort.by("rating").descending());
        }

        Pageable pageable = PageRequest.of(page, size, sort);
        return productRepository.searchProducts(
                keyword != null && !keyword.trim().isEmpty() ? keyword.trim() : null,
                categoryId,
                brandId,
                minPrice,
                maxPrice,
                minRating,
                inStockOnly,
                pageable
        );
    }

    public List<String> getSearchSuggestions(String query) {
        if (query == null || query.trim().isEmpty()) {
            return List.of(
                    "iPhone 15 Pro",
                    "Wireless Bluetooth Earbuds",
                    "Smart Watch for Men & Women",
                    "Running Shoes under 2999",
                    "Sony Noise Cancelling Headphones",
                    "Air Fryer & Kitchen Cookware",
                    "Samsung Galaxy 5G Mobile",
                    "Fire TV Stick 4K with Alexa"
            );
        }

        String raw = query.trim();
        String q = raw.toLowerCase();
        Set<String> resultSet = new LinkedHashSet<>();

        // 1. Database matches across title, description, brand, and category
        List<String> dbTitles = productRepository.findSearchSuggestions(q, PageRequest.of(0, 8));
        resultSet.addAll(dbTitles);

        // 2. Keyword expansions dictionary for e-commerce search
        Map<String, List<String>> keywordExpansions = Map.ofEntries(
                Map.entry("dress", List.of("dresses for women", "dress western wear", "dresses under 499", "dress floral printed", "dress party wear")),
                Map.entry("shoe", List.of("shoes for men", "shoes sneakers", "shoes running", "shoes under 999", "shoes casual")),
                Map.entry("phone", List.of("phone 5g", "phone case", "phone charger", "phone under 20000", "smartphones")),
                Map.entry("watch", List.of("watch for men", "watch for women", "watch smart", "watch under 499", "watch analog")),
                Map.entry("earbud", List.of("earbuds bluetooth", "earbuds boat", "earbuds noise cancelling", "earbuds under 999")),
                Map.entry("kurta", List.of("kurtas for women", "kurtas under 399", "kurta set with palazzo", "kurta cotton")),
                Map.entry("charger", List.of("charger type c", "charger fast charging 25w", "charger for iphone", "charger adapter")),
                Map.entry("clock", List.of("wall clocks for home", "wall clocks vintage", "alarm clocks", "wall clock silent sweep")),
                Map.entry("tv", List.of("tv 55 inch 4k", "tv smart led", "tv fire stick", "tv qled 4k")),
                Map.entry("mixer", List.of("mixer grinder 750w", "mixer grinder prestige", "mixer grinder with 4 jars")),
                Map.entry("laptop", List.of("laptops for students", "laptop gaming oled", "laptop macbook air", "laptop bags under 499")),
                Map.entry("almond", List.of("almonds 500g", "almonds california raw", "dry fruits & seeds combo"))
        );

        for (Map.Entry<String, List<String>> entry : keywordExpansions.entrySet()) {
            if (q.contains(entry.getKey()) || entry.getKey().contains(q)) {
                for (String exp : entry.getValue()) {
                    resultSet.add(capitalizeWords(exp));
                }
            }
        }

        // 3. Dynamic smart Amazon-style completions for whatever query is typed
        resultSet.add(capitalizeWords(raw) + " in All Categories");
        resultSet.add(capitalizeWords(raw) + " under 499");
        resultSet.add(capitalizeWords(raw) + " deals today");
        resultSet.add(capitalizeWords(raw) + " for men");
        resultSet.add(capitalizeWords(raw) + " for home & kitchen");
        resultSet.add(capitalizeWords(raw) + " top rated");

        // 4. Fill with trending suggestions if needed
        List<String> trending = List.of(
                "Best Deals in Electronics",
                "Top Offers on Smartphones",
                "Lowest Prices on Amazon",
                "Bestselling Kurtas & Fashion",
                "Everyday Kitchen Essentials"
        );
        for (String t : trending) {
            if (resultSet.size() >= 10) break;
            resultSet.add(t);
        }

        List<String> resultList = new ArrayList<>(resultSet);
        return resultList.subList(0, Math.min(resultList.size(), 10));
    }

    private String capitalizeWords(String str) {
        if (str == null || str.isEmpty()) return str;
        String[] words = str.split("\\s+");
        StringBuilder sb = new StringBuilder();
        for (String w : words) {
            if (!w.isEmpty()) {
                sb.append(Character.toUpperCase(w.charAt(0)));
                if (w.length() > 1) {
                    sb.append(w.substring(1).toLowerCase());
                }
                sb.append(" ");
            }
        }
        return sb.toString().trim();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", id));
    }

    public Product getProductBySlug(String slug) {
        return productRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "slug", slug));
    }

    public List<Product> getFeaturedProducts() {
        return productRepository.findByFeaturedTrueAndActiveTrue();
    }

    public List<Product> getBestSellers() {
        return productRepository.findByBestSellerTrueAndActiveTrue();
    }

    public List<Product> getTrendingProducts() {
        return productRepository.findByTrendingTrueAndActiveTrue();
    }

    public List<Product> getSimilarProducts(Long categoryId, Long productId) {
        List<Product> similar = new ArrayList<>(productRepository.findSimilarProducts(categoryId, productId, PageRequest.of(0, 8)));
        if (similar.size() < 8) {
            List<Product> fallback = productRepository.findFallbackSimilarProducts(productId, PageRequest.of(0, 12));
            for (Product p : fallback) {
                if (similar.stream().noneMatch(s -> s.getId().equals(p.getId()))) {
                    similar.add(p);
                }
                if (similar.size() >= 8) break;
            }
        }
        return similar;
    }

    public List<Product> getFrequentlyBoughtTogether() {
        return productRepository.findFrequentlyBoughtTogether(PageRequest.of(0, 4));
    }

    @Transactional
    public Product createProduct(Product product, Long categoryId, Long brandId, List<String> imageUrls) {
        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
        Brand brand = brandRepository.findById(brandId)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", brandId));

        product.setCategory(category);
        product.setBrand(brand);

        Product savedProduct = productRepository.save(product);

        if (imageUrls != null && !imageUrls.isEmpty()) {
            int order = 0;
            for (String url : imageUrls) {
                if (url != null && !url.trim().isEmpty()) {
                    ProductImage img = new ProductImage(savedProduct, url.trim(), order == 0, order);
                    productImageRepository.save(img);
                    savedProduct.getImages().add(img);
                    order++;
                }
            }
        }

        return savedProduct;
    }

    @Transactional
    public Product updateProduct(Long id, Product updatedData, Long categoryId, Long brandId, List<String> imageUrls) {
        Product product = getProductById(id);

        product.setTitle(updatedData.getTitle());
        product.setDescription(updatedData.getDescription());
        product.setShortDescription(updatedData.getShortDescription());
        product.setPrice(updatedData.getPrice());
        product.setMrp(updatedData.getMrp());
        product.setStockQuantity(updatedData.getStockQuantity());
        product.setSku(updatedData.getSku());
        product.setModelNumber(updatedData.getModelNumber());
        product.setWarrantyPeriod(updatedData.getWarrantyPeriod());
        product.setReturnPolicy(updatedData.getReturnPolicy());
        product.setFeatured(updatedData.isFeatured());
        product.setBestSeller(updatedData.isBestSeller());
        product.setTrending(updatedData.isTrending());
        product.setVideoUrl(updatedData.getVideoUrl());
        product.setSpecsJson(updatedData.getSpecsJson());
        product.setOffersJson(updatedData.getOffersJson());
        product.setActive(updatedData.isActive());

        if (categoryId != null) {
            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new ResourceNotFoundException("Category", "id", categoryId));
            product.setCategory(category);
        }

        if (brandId != null) {
            Brand brand = brandRepository.findById(brandId)
                    .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", brandId));
            product.setBrand(brand);
        }

        if (imageUrls != null && !imageUrls.isEmpty()) {
            product.getImages().clear();
            productImageRepository.deleteByProductId(product.getId());

            int order = 0;
            for (String url : imageUrls) {
                if (url != null && !url.trim().isEmpty()) {
                    ProductImage img = new ProductImage(product, url.trim(), order == 0, order);
                    productImageRepository.save(img);
                    product.getImages().add(img);
                    order++;
                }
            }
        }

        return productRepository.save(product);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        reviewRepository.deleteByProductId(id);
        productRepository.delete(product);
    }
}
