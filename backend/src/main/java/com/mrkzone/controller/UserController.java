package com.mrkzone.controller;

import com.mrkzone.dto.ApiResponse;
import com.mrkzone.model.Address;
import com.mrkzone.model.Notification;
import com.mrkzone.model.User;
import com.mrkzone.repository.AddressRepository;
import com.mrkzone.repository.NotificationRepository;
import com.mrkzone.repository.UserRepository;
import com.mrkzone.security.UserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final AddressRepository addressRepository;
    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public UserController(AddressRepository addressRepository,
                          NotificationRepository notificationRepository,
                          UserRepository userRepository) {
        this.addressRepository = addressRepository;
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    @GetMapping("/addresses")
    public ResponseEntity<ApiResponse<List<Address>>> getAddresses(@AuthenticationPrincipal UserPrincipal principal) {
        List<Address> addresses = addressRepository.findByUserId(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Addresses retrieved", addresses));
    }

    @PostMapping("/addresses")
    public ResponseEntity<ApiResponse<Address>> addAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody Address address) {
        User user = userRepository.findById(principal.getId()).orElseThrow();
        address.setUser(user);
        if (address.isDefault()) {
            addressRepository.findByUserId(principal.getId()).forEach(a -> {
                a.setDefault(false);
                addressRepository.save(a);
            });
        }
        Address saved = addressRepository.save(address);
        return ResponseEntity.ok(ApiResponse.success("Address added", saved));
    }

    @DeleteMapping("/addresses/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteAddress(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        addressRepository.findById(id).ifPresent(a -> {
            if (a.getUser().getId().equals(principal.getId())) {
                addressRepository.delete(a);
            }
        });
        return ResponseEntity.ok(ApiResponse.success("Address deleted"));
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<Notification>>> getNotifications(@AuthenticationPrincipal UserPrincipal principal) {
        List<Notification> notifications = notificationRepository.findByUserIdOrderByCreatedAtDesc(principal.getId());
        return ResponseEntity.ok(ApiResponse.success("Notifications", notifications));
    }

    @PutMapping("/notifications/{id}/read")
    public ResponseEntity<ApiResponse<Void>> markNotificationRead(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id) {
        notificationRepository.findById(id).ifPresent(n -> {
            if (n.getUser() != null && n.getUser().getId().equals(principal.getId())) {
                n.setRead(true);
                notificationRepository.save(n);
            }
        });
        return ResponseEntity.ok(ApiResponse.success("Marked as read"));
    }
}
