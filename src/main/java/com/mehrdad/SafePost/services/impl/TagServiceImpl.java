package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.domain.entities.Tag;
import com.mehrdad.SafePost.repositories.TagRepository;
import com.mehrdad.SafePost.services.TagService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TagServiceImpl implements TagService {

    private final TagRepository tagRepository;

    @Override
    public List<Tag> getTags() {
        return tagRepository.findAllWithPostCount();
    }
}
