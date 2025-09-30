package com.mehrdad.SafePost.services;

import com.mehrdad.SafePost.domain.entities.User;

import java.util.UUID;

public interface UserService {
    User getUserById(UUID id);
}
