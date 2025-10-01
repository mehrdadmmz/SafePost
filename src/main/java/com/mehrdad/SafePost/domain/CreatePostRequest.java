package com.mehrdad.SafePost.domain;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreatePostRequest {
    private String title;

    private String content;

    private UUID categoryId;

    private Set<UUID> tagIds = new HashSet<>();

    private PostStatus status;
}
