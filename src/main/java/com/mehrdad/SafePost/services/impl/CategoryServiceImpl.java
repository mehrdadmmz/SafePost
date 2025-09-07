package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.domain.entities.Category;
import com.mehrdad.SafePost.repositories.CategoryRepository;
import com.mehrdad.SafePost.services.CategoryService;
import jakarta.transaction.Transactional;
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

    @Override
    @Transactional
    public Category createCategory(Category category) {
        String categoryName = category.getName();
        if (categoryRepository.existsByNameIgnoreCase(categoryName)) {
            throw new IllegalArgumentException("Category with name " + categoryName + " already exists");
        }
        return categoryRepository.save(category);
    }
}
