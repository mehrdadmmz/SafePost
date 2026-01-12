package com.mehrdad.SafePost.domain.dtos;

import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class UpdateProfileRequest {

    @Size(max = 1000, message = "Bio must not exceed 1000 characters")
    private String bio;

    @Size(max = 255, message = "Location must not exceed 255 characters")
    private String location;

    @Pattern(regexp = "^$|^https?://(www\\.)?(twitter\\.com|x\\.com)/.*", message = "Invalid Twitter/X URL")
    private String twitterUrl;

    @Pattern(regexp = "^$|^https?://(www\\.)?github\\.com/.*", message = "Invalid GitHub URL")
    private String githubUrl;

    @Pattern(regexp = "^$|^https?://(www\\.)?linkedin\\.com/.*", message = "Invalid LinkedIn URL")
    private String linkedinUrl;

    @Pattern(regexp = "^$|^https?://.*", message = "Invalid website URL")
    private String websiteUrl;

    private String avatarUrl;
    private String avatarFilename;
}
