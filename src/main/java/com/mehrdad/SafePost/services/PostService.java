package com.mehrdad.SafePost.services;

import com.mehrdad.SafePost.domain.CreatePostRequest;
import com.mehrdad.SafePost.domain.UpdatePostRequest;
import com.mehrdad.SafePost.domain.dtos.UpdatePostRequestDto;
import com.mehrdad.SafePost.domain.entities.Post;
import com.mehrdad.SafePost.domain.entities.User;

import java.util.List;
import java.util.UUID;

public interface PostService {

    // get a post with its id
    Post getPost(UUID id);

    // getting all the posts
    List<Post> getAllPosts(UUID categoryId, UUID tagId);
    List<Post> getDraftPosts(User user);

    // Search posts
    List<Post> searchPosts(String query, UUID categoryId, UUID tagId);

    Post createPost(User user, CreatePostRequest createPostRequest);
    Post updatePost(UUID id, UUID userId, UpdatePostRequest updatePostRequest);

    void deletePost(UUID id, UUID userId);

    // View counter
    void incrementViewCount(UUID postId);
}
