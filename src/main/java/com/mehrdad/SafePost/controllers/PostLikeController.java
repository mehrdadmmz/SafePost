package com.mehrdad.SafePost.controllers;

import com.mehrdad.SafePost.domain.dtos.LikeResponse;
import com.mehrdad.SafePost.services.PostLikeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/posts/{postId}/likes")
@RequiredArgsConstructor
public class PostLikeController {

    private final PostLikeService postLikeService;

    @PostMapping
    public ResponseEntity<LikeResponse> toggleLike(
            @PathVariable UUID postId,
            @RequestAttribute UUID userId) {
        LikeResponse response = postLikeService.toggleLike(postId, userId);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<LikeResponse> getLikeStatus(
            @PathVariable UUID postId,
            @RequestAttribute(required = false) UUID userId) {
        Integer likesCount = postLikeService.getLikesCount(postId);
        Boolean liked = userId != null && postLikeService.hasUserLikedPost(postId, userId);

        LikeResponse response = LikeResponse.builder()
                .likesCount(likesCount)
                .liked(liked)
                .build();

        return ResponseEntity.ok(response);
    }
}
