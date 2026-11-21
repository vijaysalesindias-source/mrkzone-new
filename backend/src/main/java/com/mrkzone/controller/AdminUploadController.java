package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.*;
import java.util.*;

@RestController
@RequestMapping("/api/admin/uploads")
public class AdminUploadController {
    @Value("${mrkzone.upload.dir:./uploads}")
    private String uploadDir;

    @PostMapping
    public ResponseEntity<ApiResponse<List<String>>> uploadImages(@RequestParam("files") List<MultipartFile> files) throws IOException {
        if (files == null || files.isEmpty()) {
            return ResponseEntity.badRequest().body(ApiResponse.error("Please select at least one image"));
        }
        Path directory = Paths.get(uploadDir, "products").toAbsolutePath().normalize();
        Files.createDirectories(directory);
        List<String> urls = new ArrayList<>();
        for (MultipartFile file : files) {
            if (file.isEmpty()) continue;
            String contentType = file.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(ApiResponse.error("Only image files are allowed"));
            }
            String original = Optional.ofNullable(file.getOriginalFilename()).orElse("image");
            String extension = original.contains(".") ? original.substring(original.lastIndexOf('.')).replaceAll("[^.a-zA-Z0-9]", "") : ".jpg";
            String filename = UUID.randomUUID() + extension;
            Files.copy(file.getInputStream(), directory.resolve(filename), StandardCopyOption.REPLACE_EXISTING);
            urls.add("/uploads/products/" + filename);
        }
        return ResponseEntity.ok(ApiResponse.success("Images uploaded", urls));
    }
}
