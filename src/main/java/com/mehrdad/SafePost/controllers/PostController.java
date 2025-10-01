package com.mehrdad.SafePost.controllers;

import com.mehrdad.SafePost.domain.CreatePostRequest;
import com.mehrdad.SafePost.domain.UpdatePostRequest;
import com.mehrdad.SafePost.domain.dtos.CreatePostRequestDto;
import com.mehrdad.SafePost.domain.dtos.PostDto;
import com.mehrdad.SafePost.domain.dtos.UpdatePostRequestDto;
import com.mehrdad.SafePost.domain.entities.Post;
import com.mehrdad.SafePost.domain.entities.User;
import com.mehrdad.SafePost.mappers.PostMapper;
import com.mehrdad.SafePost.services.PostService;
import com.mehrdad.SafePost.services.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping(path = "/api/v1/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;
    private final PostMapper postMapper;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<List<PostDto>> getAllPosts(
            @RequestParam(required = false) UUID categoryId,
            @RequestParam(required = false) UUID tagId) {

        List<Post> posts = postService.getAllPosts(categoryId, tagId);

        // convert them all to the post DTOs
        List<PostDto> postDtos =  posts.stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }

    // Draft post endpoint
    @GetMapping(path = "/drafts")
    public ResponseEntity<List<PostDto>> getDrafts(@RequestAttribute UUID userId) {
        User loggedInUser = userService.getUserById(userId);
        List<Post> draftPosts = postService.getDraftPosts(loggedInUser);
        List<PostDto> postDtos = draftPosts.stream().map(postMapper::toDto).toList();
        return ResponseEntity.ok(postDtos);
    }

    @PostMapping
    public ResponseEntity<PostDto> createPost(
            @Valid @RequestBody CreatePostRequestDto createPostRequestDto,
            @RequestAttribute UUID userId) {
        User loggedInUser = userService.getUserById(userId);
        CreatePostRequest createPostRequest = postMapper.toCreatePostRequest(createPostRequestDto);

        Post createdPost = postService.createPost(loggedInUser, createPostRequest);
        PostDto createdPostDto = postMapper.toDto(createdPost);

        return new ResponseEntity<>(createdPostDto,HttpStatus.CREATED);
    }

    @PutMapping(path = "/{id}")
    public ResponseEntity<PostDto> updatePost(
            @PathVariable UUID id,
            @Valid @RequestBody UpdatePostRequestDto updatePostRequestDto) {
            UpdatePostRequest updatePostRequest = postMapper.toUpdatePostRequest(updatePostRequestDto);
    }
}
