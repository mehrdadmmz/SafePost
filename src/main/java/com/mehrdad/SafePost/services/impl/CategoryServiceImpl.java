package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.domain.entities.Category;
import com.mehrdad.SafePost.repositories.CategoryRepository;
import com.mehrdad.SafePost.services.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository categoryRepository;

    @Override
    public List<Category> listCategories() {
        return categoryRepository.findAllWithPostCount();
    }
}
