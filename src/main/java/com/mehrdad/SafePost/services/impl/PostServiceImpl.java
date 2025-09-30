package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.domain.PostStatus;
import com.mehrdad.SafePost.domain.entities.Category;
import com.mehrdad.SafePost.domain.entities.Post;
import com.mehrdad.SafePost.domain.entities.Tag;
import com.mehrdad.SafePost.repositories.PostRepository;
import com.mehrdad.SafePost.services.CategoryService;
import com.mehrdad.SafePost.services.PostService;
import com.mehrdad.SafePost.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;

    @Override
    @Transactional(readOnly = true)
    public List<Post> getAllPosts(UUID categoryId, UUID tagId) {

        // when both category id and tag id are specified
        if (categoryId != null && tagId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            Tag tag = tagService.getTagByID(tagId);
            return postRepository.findAllByStatusAndCategoryAndTagsContaining(
                    PostStatus.PUBLISHED,
                    category,
                    tag
            );
        }
    }
}
