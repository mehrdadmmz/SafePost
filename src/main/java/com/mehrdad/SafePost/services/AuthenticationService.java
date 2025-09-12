package com.mehrdad.SafePost.services;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

public interface AuthenticationService {
    UserDetails authenticate(String email, String password);
    String generateToken(UserDetails userDetails);
}
