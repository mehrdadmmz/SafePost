package com.mehrdad.SafePost.domain.dtos;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UserProfileResponse {
    private UUID id;
    private String name;
    private String email;
    private String role;
    private LocalDateTime createdAt;

    // Profile fields
    private String bio;
    private String avatarUrl;
    private String twitterUrl;
    private String githubUrl;
    private String linkedinUrl;
    private String websiteUrl;
    private String location;
    private Integer postCount;
}
