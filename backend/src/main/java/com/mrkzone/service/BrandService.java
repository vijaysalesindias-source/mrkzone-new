package com.mrkzone.service;

import com.mrkzone.exception.ResourceNotFoundException;
import com.mrkzone.model.Brand;
import com.mrkzone.repository.BrandRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class BrandService {

    private final BrandRepository brandRepository;

    public BrandService(BrandRepository brandRepository) {
        this.brandRepository = brandRepository;
    }

    public List<Brand> getAllActiveBrands() {
        return brandRepository.findByActiveTrue();
    }

    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    public Brand getBrandById(Long id) {
        return brandRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "id", id));
    }

    public Brand getBrandBySlug(String slug) {
        return brandRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Brand", "slug", slug));
    }

    @Transactional
    public Brand createBrand(Brand brand) {
        return brandRepository.save(brand);
    }

    @Transactional
    public Brand updateBrand(Long id, Brand data) {
        Brand brand = getBrandById(id);
        brand.setName(data.getName());
        brand.setSlug(data.getSlug());
        brand.setLogoUrl(data.getLogoUrl());
        brand.setDescription(data.getDescription());
        brand.setFeatured(data.isFeatured());
        brand.setActive(data.isActive());
        return brandRepository.save(brand);
    }

    @Transactional
    public void deleteBrand(Long id) {
        Brand brand = getBrandById(id);
        brandRepository.delete(brand);
    }
}
