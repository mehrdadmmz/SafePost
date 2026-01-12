package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.domain.dtos.LikeResponse;
import com.mehrdad.SafePost.domain.entities.Post;
import com.mehrdad.SafePost.domain.entities.PostLike;
import com.mehrdad.SafePost.domain.entities.User;
import com.mehrdad.SafePost.repositories.PostLikeRepository;
import com.mehrdad.SafePost.repositories.PostRepository;
import com.mehrdad.SafePost.services.PostLikeService;
import com.mehrdad.SafePost.services.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostLikeServiceImpl implements PostLikeService {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;
    private final UserService userService;

    @Override
    @Transactional
    public LikeResponse toggleLike(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));
        User user = userService.getUserById(userId);

        Optional<PostLike> existingLike = postLikeRepository.findByPostAndUser(post, user);

        boolean liked;
        if (existingLike.isPresent()) {
            // Unlike: delete like and decrement counter
            postLikeRepository.delete(existingLike.get());
            post.setLikesCount(Math.max(0, post.getLikesCount() - 1));
            liked = false;
            log.info("User {} unliked post {}", userId, postId);
        } else {
            // Like: create like and increment counter
            PostLike newLike = PostLike.builder()
                    .post(post)
                    .user(user)
                    .build();
            postLikeRepository.save(newLike);
            post.setLikesCount(post.getLikesCount() + 1);
            liked = true;
            log.info("User {} liked post {}", userId, postId);
        }

        postRepository.save(post);

        return LikeResponse.builder()
                .likesCount(post.getLikesCount())
                .liked(liked)
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public boolean hasUserLikedPost(UUID postId, UUID userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));
        User user = userService.getUserById(userId);

        return postLikeRepository.existsByPostAndUser(post, user);
    }

    @Override
    @Transactional(readOnly = true)
    public Integer getLikesCount(UUID postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("Post not found with id: " + postId));
        return post.getLikesCount();
    }
}
