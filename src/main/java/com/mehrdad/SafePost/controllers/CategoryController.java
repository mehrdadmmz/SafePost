package com.mehrdad.SafePost.controllers;

import com.mehrdad.SafePost.domain.dtos.CategoryDto;
import com.mehrdad.SafePost.domain.dtos.CreateCategoryRequest;
import com.mehrdad.SafePost.domain.entities.Category;
import com.mehrdad.SafePost.mappers.CategoryMapper;
import com.mehrdad.SafePost.services.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/api/v1/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;
    private final CategoryMapper categoryMapper;

    @GetMapping
    public ResponseEntity<List<CategoryDto>> listCategories() {
        List<CategoryDto> categories = categoryService.listCategories()
                .stream()
                .map(categoryMapper::toDto)
                .toList();

        return ResponseEntity.ok(categories);
    }

    @PostMapping
    /* We could use the category dto in the argument, but I will be using a dedicated dto
    which allows us to use some validation annotation like to check if the arg we passed
    satisfies the length, not being null, and not being blank. Checkout CreateCategoryRequest
    in the dto package. We add the @Valid so it needs to pass those requirements mentioned there. */
    public ResponseEntity<CategoryDto> createCategory(
            @Valid @RequestBody CreateCategoryRequest createCategoryRequest) {
         Category categoryToCreate = categoryMapper.toEntity(createCategoryRequest);
         Category savedCategory = categoryService.createCategory(categoryToCreate);
         return new ResponseEntity<>(
                 categoryMapper.toDto(savedCategory),
                 HttpStatus.CREATED
         );
    }
}
