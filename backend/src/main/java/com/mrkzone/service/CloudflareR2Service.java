package com.mrkzone.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.S3Configuration;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.net.URI;
import java.util.UUID;

@Service
public class CloudflareR2Service {

    @Value("${mrkzone.storage.r2.account-id:}")
    private String accountId;

    @Value("${mrkzone.storage.r2.access-key:}")
    private String accessKey;

    @Value("${mrkzone.storage.r2.secret-key:}")
    private String secretKey;

    @Value("${mrkzone.storage.r2.bucket-name:}")
    private String bucketName;

    @Value("${mrkzone.storage.r2.public-url:}")
    private String publicUrl;

    public String upload(byte[] data, String contentType, String extension) {
        if (accountId.isBlank() || accessKey.isBlank()
                || secretKey.isBlank() || bucketName.isBlank()
                || publicUrl.isBlank()) {
            throw new IllegalStateException("Cloudflare R2 configuration is incomplete");
        }

        String endpoint = "https://" + accountId + ".r2.cloudflarestorage.com";
        String key = "products/" + UUID.randomUUID() + extension;

        try (S3Client s3 = S3Client.builder()
                .endpointOverride(URI.create(endpoint))
                .region(Region.of("auto"))
                .credentialsProvider(StaticCredentialsProvider.create(
                        AwsBasicCredentials.create(accessKey, secretKey)))
                .serviceConfiguration(S3Configuration.builder()
                        .pathStyleAccessEnabled(true)
                        .build())
                .build()) {

            s3.putObject(
                    PutObjectRequest.builder()
                            .bucket(bucketName)
                            .key(key)
                            .contentType(contentType)
                            .build(),
                    software.amazon.awssdk.core.sync.RequestBody.fromBytes(data)
            );
        }

        return publicUrl.replaceAll("/+$", "") + "/" + key;
    }
}
