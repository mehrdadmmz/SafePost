package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.domain.entities.Post;
import com.mehrdad.SafePost.repositories.PostRepository;
import com.mehrdad.SafePost.services.CategoryService;
import com.mehrdad.SafePost.services.PostService;
import com.mehrdad.SafePost.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;

    @Override
    public List<Post> getAllPosts(UUID categoryId, UUID tagId) {

    }
}
