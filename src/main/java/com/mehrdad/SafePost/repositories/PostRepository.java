package com.mehrdad.SafePost.repositories;

import com.mehrdad.SafePost.domain.PostStatus;
import com.mehrdad.SafePost.domain.entities.Category;
import com.mehrdad.SafePost.domain.entities.Post;
import com.mehrdad.SafePost.domain.entities.Tag;
import com.mehrdad.SafePost.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PostRepository extends JpaRepository<Post, UUID> {
    // we need the post status because we only need the published posts
    // the name of the function is by convention so that the spring data JpaRepository can implement it for us.
    List<Post> findAllByStatusAndCategoryAndTagsContaining(PostStatus status, Category category, Tag tag);
    List<Post> findAllByStatusAndCategory(PostStatus status, Category category);
    List<Post> findAllByStatusAndTagsContaining(PostStatus status, Tag tag);
    List<Post> findAllByStatus(PostStatus status);
    List<Post> findALlByAuthorAndStatus(User author, PostStatus status);
}
