package com.mehrdad.SafePost.mappers;

import com.mehrdad.SafePost.domain.dtos.PostDto;
import com.mehrdad.SafePost.domain.entities.Post;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface PostMapper {

    // Each annotation tells MapStruct to map the author, category, and tags fields from
    // the source (Post) to the corresponding fields in the target (PostDto).
    @Mapping(target = "author", source = "author")
    @Mapping(target = "category", source = "category")
    @Mapping(target = "tags", source = "tags")
    PostDto toDto(Post post);
}
