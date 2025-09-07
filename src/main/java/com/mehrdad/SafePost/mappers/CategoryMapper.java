package com.mehrdad.SafePost.mappers;

import com.mehrdad.SafePost.domain.PostStatus;
import com.mehrdad.SafePost.domain.dtos.CategoryDto;
import com.mehrdad.SafePost.domain.entities.Category;
import com.mehrdad.SafePost.domain.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {

    // we need to populate the value of postCount in our DTO. So we can define a
    // method in this interface to do that for us.
    @Mapping(target = "postCount", source = "posts", qualifiedByName = "calculatePostCount")
    CategoryDto toDto(Category category);

    @Named("calculatePostCount")
    default long calculatePostCount(List<Post>  posts) {
        if (posts ==  null) {
            return 0;
        }
        return posts.stream()
                .filter(post -> PostStatus.PUBLISHED.equals(post.getStatus()))
                .count();
    }
}
