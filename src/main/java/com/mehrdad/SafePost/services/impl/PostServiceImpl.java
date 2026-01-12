package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.domain.CreatePostRequest;
import com.mehrdad.SafePost.domain.PostStatus;
import com.mehrdad.SafePost.domain.UpdatePostRequest;
import com.mehrdad.SafePost.domain.entities.Category;
import com.mehrdad.SafePost.domain.entities.Post;
import com.mehrdad.SafePost.domain.entities.Tag;
import com.mehrdad.SafePost.domain.entities.User;
import com.mehrdad.SafePost.domain.enums.Role;
import com.mehrdad.SafePost.repositories.PostRepository;
import com.mehrdad.SafePost.services.CategoryService;
import com.mehrdad.SafePost.services.PostService;
import com.mehrdad.SafePost.services.TagService;
import com.mehrdad.SafePost.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PostServiceImpl implements PostService {

    private final PostRepository postRepository;
    private final CategoryService categoryService;
    private final TagService tagService;
    private final UserService userService;

    private static final int WORDS_PER_MINUTE = 200;

    @Override
    public Post getPost(UUID id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> getAllPosts(UUID categoryId, UUID tagId) {

        // both category id and tag id are specified
        if (categoryId != null && tagId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            Tag tag = tagService.getTagByID(tagId);
            return postRepository.findAllByStatusAndCategoryAndTagsContaining(
                    PostStatus.PUBLISHED,
                    category,
                    tag
            );
        }

        // if category id exists only
        if (categoryId != null) {
            Category category = categoryService.getCategoryById(categoryId);
            return postRepository.findAllByStatusAndCategory(
                    PostStatus.PUBLISHED,
                    category
            );
        }

        // if tag id exists only
        if (tagId != null) {
            Tag tag = tagService.getTagByID(tagId);
            return postRepository.findAllByStatusAndTagsContaining(
                    PostStatus.PUBLISHED,
                    tag
            );
        }

        // when both are null --> we want to return all the published posts
        return postRepository.findAllByStatus(PostStatus.PUBLISHED);
    }

    @Override
    public List<Post> getDraftPosts(User user) {
        return postRepository.findALlByAuthorAndStatus(user, PostStatus.DRAFT);
    }

    @Override
    @Transactional
    public Post createPost(User user, CreatePostRequest createPostRequest) {
        Post newPost = new Post();
        newPost.setTitle(createPostRequest.getTitle());
        newPost.setContent(createPostRequest.getContent());
        newPost.setStatus(createPostRequest.getStatus());
        newPost.setAuthor(user);
        newPost.setReadingTime(calculateReadingTime(createPostRequest.getContent()));

        // Set cover image fields if provided
        newPost.setCoverImageUrl(createPostRequest.getCoverImageUrl());
        newPost.setCoverImageFilename(createPostRequest.getCoverImageFilename());
        newPost.setCoverImageSize(createPostRequest.getCoverImageSize());
        newPost.setCoverImageContentType(createPostRequest.getCoverImageContentType());

        Category category = categoryService.getCategoryById(createPostRequest.getCategoryId());
        newPost.setCategory(category);

        Set<UUID> tagIds = createPostRequest.getTagIds();
        List<Tag> tags = tagService.getTagByIds(tagIds);
        newPost.setTags(new HashSet<>(tags));

        return postRepository.save(newPost);
    }

    // simple private method to calculate the reading time of the post
    private Integer calculateReadingTime(String content) {
        if (content == null || content.isEmpty()) {
            return 0;
        }

        int wordCount = content.trim().split("\\s+").length;
        return (int) Math.ceil((double) wordCount / WORDS_PER_MINUTE);
    }

    @Override
    @Transactional
    public Post updatePost(UUID id, UUID userId, UpdatePostRequest updatePostRequest) {
        Post existingPost = postRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Post with id " + id + " not found!"));

        // Check ownership - users can only update their own posts
        if (!existingPost.getAuthor().getId().equals(userId)) {
            throw new AccessDeniedException("You can only update your own posts");
        }

        String postContent = updatePostRequest.getContent();

        existingPost.setTitle(updatePostRequest.getTitle());
        existingPost.setContent(postContent);
        existingPost.setStatus(updatePostRequest.getStatus());
        existingPost.setReadingTime(calculateReadingTime(postContent));

        UUID updatePostRequestCategoryId = updatePostRequest.getCategoryId();
        if (!existingPost.getCategory().getId().equals(updatePostRequestCategoryId)) {
            Category newCategory = categoryService.getCategoryById(updatePostRequestCategoryId);
            existingPost.setCategory(newCategory);
        }

        Set<UUID> existingTagIds = existingPost.getTags().stream().map(Tag::getId).collect(Collectors.toSet());
        Set<UUID> updatePostRequestTagIds = updatePostRequest.getTagIds();
        if (!existingTagIds.equals(updatePostRequestTagIds)) {
            List<Tag> newTags = tagService.getTagByIds(updatePostRequestTagIds);
            existingPost.setTags(new HashSet<>(newTags));
        }

        // Update cover image fields if provided
        existingPost.setCoverImageUrl(updatePostRequest.getCoverImageUrl());
        existingPost.setCoverImageFilename(updatePostRequest.getCoverImageFilename());
        existingPost.setCoverImageSize(updatePostRequest.getCoverImageSize());
        existingPost.setCoverImageContentType(updatePostRequest.getCoverImageContentType());

        return postRepository.save(existingPost);
    }

    @Override
    public void deletePost(UUID id, UUID userId) {
        Post post = getPost(id);
        User currentUser = userService.getUserById(userId);

        // Allow deletion if user is the author OR if user is an admin (for moderation)
        boolean isAuthor = post.getAuthor().getId().equals(userId);
        boolean isAdmin = currentUser.getRole() == Role.ADMIN;

        if (!isAuthor && !isAdmin) {
            throw new AccessDeniedException("You can only delete your own posts");
        }

        postRepository.delete(post);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Post> searchPosts(String query, UUID categoryId, UUID tagId) {
        // If query is null or empty, return regular posts
        if (query == null || query.trim().isEmpty()) {
            return getAllPosts(categoryId, tagId);
        }

        String sanitizedQuery = query.trim();

        // Search with both category and tag filters
        if (categoryId != null && tagId != null) {
            List<Post> categoryResults = postRepository.searchPostsByCategory(
                    sanitizedQuery, categoryId, PostStatus.PUBLISHED);
            // Filter by tag manually since we can't combine in single query
            return categoryResults.stream()
                    .filter(post -> post.getTags().stream()
                            .anyMatch(tag -> tag.getId().equals(tagId)))
                    .toList();
        }

        // Search with category filter
        if (categoryId != null) {
            return postRepository.searchPostsByCategory(
                    sanitizedQuery, categoryId, PostStatus.PUBLISHED);
        }

        // Search with tag filter
        if (tagId != null) {
            return postRepository.searchPostsByTag(
                    sanitizedQuery, tagId, PostStatus.PUBLISHED);
        }

        // Search all posts
        return postRepository.searchPosts(sanitizedQuery, PostStatus.PUBLISHED);
    }

    @Override
    @Transactional
    public void incrementViewCount(UUID postId) {
        Post post = getPost(postId);
        post.setViewCount(post.getViewCount() + 1);
        postRepository.save(post);
    }
}
