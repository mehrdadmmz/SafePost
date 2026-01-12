package com.mehrdad.SafePost.services;

import com.mehrdad.SafePost.domain.dtos.LikeResponse;

import java.util.UUID;

public interface PostLikeService {

    /**
     * Toggle like on a post - if user already liked it, unlike it; otherwise, like it
     * @param postId The ID of the post
     * @param userId The ID of the user
     * @return LikeResponse containing the new like count and whether the user now likes it
     */
    LikeResponse toggleLike(UUID postId, UUID userId);

    /**
     * Check if a user has liked a post
     * @param postId The ID of the post
     * @param userId The ID of the user
     * @return true if the user has liked the post, false otherwise
     */
    boolean hasUserLikedPost(UUID postId, UUID userId);

    /**
     * Get the number of likes for a post
     * @param postId The ID of the post
     * @return The number of likes
     */
    Integer getLikesCount(UUID postId);
}
