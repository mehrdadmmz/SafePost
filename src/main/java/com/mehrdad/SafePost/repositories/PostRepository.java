package com.mehrdad.SafePost.repositories;

import com.mehrdad.SafePost.domain.PostStatus;
import com.mehrdad.SafePost.domain.entities.Category;
import com.mehrdad.SafePost.domain.entities.Post;
import com.mehrdad.SafePost.domain.entities.Tag;
import com.mehrdad.SafePost.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
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

    // Search methods for full-text search
    @Query("SELECT DISTINCT p FROM Post p " +
           "LEFT JOIN p.author a " +
           "WHERE p.status = :status AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Post> searchPosts(@Param("query") String query, @Param("status") PostStatus status);

    @Query("SELECT DISTINCT p FROM Post p " +
           "LEFT JOIN p.author a " +
           "WHERE p.status = :status AND p.category.id = :categoryId AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Post> searchPostsByCategory(@Param("query") String query,
                                      @Param("categoryId") UUID categoryId,
                                      @Param("status") PostStatus status);

    @Query("SELECT DISTINCT p FROM Post p " +
           "LEFT JOIN p.author a " +
           "LEFT JOIN p.tags t " +
           "WHERE p.status = :status AND t.id = :tagId AND " +
           "(LOWER(p.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(p.content) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(a.name) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Post> searchPostsByTag(@Param("query") String query,
                                 @Param("tagId") UUID tagId,
                                 @Param("status") PostStatus status);
}
