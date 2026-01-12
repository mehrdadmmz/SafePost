package com.mehrdad.SafePost.services;

import com.mehrdad.SafePost.domain.dtos.RegisterRequest;
import com.mehrdad.SafePost.domain.dtos.UserProfileResponse;
import com.mehrdad.SafePost.domain.entities.User;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.UUID;

public interface AuthenticationService {
    UserDetails authenticate(String email, String password);
    String generateToken(UserDetails userDetails);
    UserDetails validateToken(String token);
    User register(RegisterRequest request);
    UserProfileResponse getUserProfile(UUID userId);
}
