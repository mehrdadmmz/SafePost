package com.mehrdad.SafePost.controllers;

import com.mehrdad.SafePost.domain.dtos.UpdateProfileRequest;
import com.mehrdad.SafePost.domain.dtos.UserProfileResponse;
import com.mehrdad.SafePost.domain.entities.User;
import com.mehrdad.SafePost.repositories.UserRepository;
import com.mehrdad.SafePost.security.BlogUserDetails;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
@Slf4j
public class UserProfileController {

    private final UserRepository userRepository;

    @GetMapping("/{id}/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@PathVariable UUID id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .twitterUrl(user.getTwitterUrl())
                .githubUrl(user.getGithubUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .websiteUrl(user.getWebsiteUrl())
                .location(user.getLocation())
                .postCount(user.getPosts() != null ? user.getPosts().size() : 0)
                .build();

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(
            @AuthenticationPrincipal BlogUserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {

        User user = userRepository.findById(userDetails.getId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Update profile fields
        user.setBio(request.getBio());
        user.setLocation(request.getLocation());
        user.setTwitterUrl(request.getTwitterUrl());
        user.setGithubUrl(request.getGithubUrl());
        user.setLinkedinUrl(request.getLinkedinUrl());
        user.setWebsiteUrl(request.getWebsiteUrl());

        // Update avatar (allows null to clear avatar)
        user.setAvatarUrl(request.getAvatarUrl());
        user.setAvatarFilename(request.getAvatarFilename());

        // Mark profile as completed
        if (user.getProfileCompletedAt() == null) {
            user.setProfileCompletedAt(LocalDateTime.now());
        }

        user = userRepository.save(user);

        UserProfileResponse response = UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .twitterUrl(user.getTwitterUrl())
                .githubUrl(user.getGithubUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .websiteUrl(user.getWebsiteUrl())
                .location(user.getLocation())
                .postCount(user.getPosts() != null ? user.getPosts().size() : 0)
                .build();

        log.info("Profile updated for user: {}", user.getId());
        return ResponseEntity.ok(response);
    }
}
