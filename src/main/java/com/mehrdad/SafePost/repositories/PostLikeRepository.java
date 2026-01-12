package com.mehrdad.SafePost.repositories;

import com.mehrdad.SafePost.domain.entities.Post;
import com.mehrdad.SafePost.domain.entities.PostLike;
import com.mehrdad.SafePost.domain.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, UUID> {

    Optional<PostLike> findByPostAndUser(Post post, User user);

    boolean existsByPostAndUser(Post post, User user);

    void deleteByPostAndUser(Post post, User user);
}
