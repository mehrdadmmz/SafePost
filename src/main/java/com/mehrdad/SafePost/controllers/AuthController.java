package com.mehrdad.SafePost.controllers;

import com.mehrdad.SafePost.domain.dtos.AuthResponse;
import com.mehrdad.SafePost.domain.dtos.RegisterRequest;
import com.mehrdad.SafePost.domain.dtos.UserProfileResponse;
import com.mehrdad.SafePost.domain.dtos.LoginRequest;
import com.mehrdad.SafePost.domain.entities.User;
import com.mehrdad.SafePost.services.AuthenticationService;
import com.mehrdad.SafePost.services.impl.AuthenticationServiceImpl;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.UUID;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        UserDetails userDetails = authenticationService.authenticate(
                loginRequest.getEmail(),
                loginRequest.getPassword()
        );

        String tokenValue = ((AuthenticationServiceImpl) authenticationService)
                .generateToken(userDetails, loginRequest.isRememberMe());

        int expiresIn = loginRequest.isRememberMe() ? 2592000 : 86400; // 30 days or 24h
        AuthResponse authResponse = AuthResponse.builder()
                .token(tokenValue)
                .expiresIn(expiresIn)
                .build();
        return ResponseEntity.ok(authResponse);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest registerRequest) {
        // Register the user
        User newUser = authenticationService.register(registerRequest);

        // Authenticate the newly created user to get token
        UserDetails userDetails = authenticationService.authenticate(
                registerRequest.getEmail(),
                registerRequest.getPassword()
        );

        String tokenValue = authenticationService.generateToken(userDetails);
        AuthResponse authResponse = AuthResponse.builder()
                .token(tokenValue)
                .expiresIn(86400) // 24h
                .build();

        return new ResponseEntity<>(authResponse, HttpStatus.CREATED);
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getUserProfile(@RequestAttribute UUID userId) {
        UserProfileResponse profile = authenticationService.getUserProfile(userId);
        return ResponseEntity.ok(profile);
    }
}
