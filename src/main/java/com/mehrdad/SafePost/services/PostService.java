package com.mehrdad.SafePost.services;

import com.mehrdad.SafePost.domain.entities.Post;

import java.util.List;
import java.util.UUID;

public interface PostService {
    // getting all the posts
    List<Post> getAllPosts(UUID categoryId, UUID tagId);
}
