package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.domain.entities.Category;
import com.mehrdad.SafePost.repositories.CategoryRepository;
import com.mehrdad.SafePost.services.CategoryService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

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

    @Override
    public void deleteCategory(UUID id) {
        Optional<Category> category = categoryRepository.findById(id);
        if (category.isPresent()) {
            // if there are posts associated with the category, we throw an error
            if (!category.get().getPosts().isEmpty()) {
                throw new IllegalArgumentException("Category with id " + id + " already has posts");
            }
            // as we know, we get all these CRUD functions for free when using the JpaRepository
            categoryRepository.deleteById(id);
        }
    }

    @Override
    public Category getCategoryById(UUID id) {
        return categoryRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Category with id " + id + " not found"));
    }
}
