package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.service.CloudflareR2Service;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Optional;

@RestController
@RequestMapping("/api/admin/uploads")
public class AdminUploadController {

    private final CloudflareR2Service r2Service;

    public AdminUploadController(CloudflareR2Service r2Service) {
        this.r2Service = r2Service;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(
            @RequestParam("files") List<MultipartFile> files
    ) throws IOException {

        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body(
                    ApiResponse.error("Please select at least one image")
            );
        }

        List<String> urls = new ArrayList<>();

        for (MultipartFile file : files) {

            if (file.isEmpty()) {
                continue;
            }

            String contentType = file.getContentType();

            if (contentType == null ||
                    !contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
                return ResponseEntity.badRequest().body(
                        ApiResponse.error("Only image files are allowed")
                );
            }

            String original = Optional.ofNullable(
                    file.getOriginalFilename()
            ).orElse("image");

            String extension = original.contains(".")
                    ? original.substring(original.lastIndexOf('.'))
                        .replaceAll("[^a-zA-Z0-9.]", "")
                        .toLowerCase(Locale.ROOT)
                    : ".jpg";

            if (extension.isBlank() || extension.equals(".")) {
                extension = ".jpg";
            }

            String url = r2Service.upload(
                    file.getBytes(),
                    contentType,
                    extension
            );

            urls.add(url);
        }

        return ResponseEntity.ok(
                ApiResponse.success("Images uploaded", urls)
        );
    }
}
