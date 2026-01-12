package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.domain.dtos.RegisterRequest;
import com.mehrdad.SafePost.domain.dtos.UserProfileResponse;
import com.mehrdad.SafePost.domain.entities.User;
import com.mehrdad.SafePost.domain.enums.Role;
import com.mehrdad.SafePost.repositories.UserRepository;
import com.mehrdad.SafePost.services.AuthenticationService;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

/*
In a stateless JWT system:

1- Authenticate credentials
- Take email + password from a login request.
- Ask Spring Security’s AuthenticationManager to verify them (it will call UserDetailsService and PasswordEncoder under the hood).

2- Issue a JWT
- If credentials are valid, build a signed JWT containing who the user is (and optionally roles/claims).
- Return that token to the client.
- On future requests, the client sends Authorization: Bearer <token>, and your JWT filter validates the signature/expiry and sets the SecurityContext.
*/

@Service
@RequiredArgsConstructor
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AuthenticationManager authenticationManager; // Spring Security engine that verifies credentials.
    private final UserDetailsService userDetailsService; // loads user (by email/username) + authorities
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${jwt.secret}")
    private String secretKey;

    private final Long jwtExpiryMs = 86400000L; // 24 hours
    private final Long jwtExpiryMsRememberMe = 2592000000L; // 30 days

    @Override
    public UserDetails authenticate(String email, String password) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password)
        );
        return userDetailsService.loadUserByUsername(email);
    }

    @Override
    public String generateToken(UserDetails userDetails) {
        return generateToken(userDetails, false);
    }

    public String generateToken(UserDetails userDetails, boolean rememberMe) {
        Map<String,Object> claims = new HashMap<>();
        Long expiry = rememberMe ? jwtExpiryMsRememberMe : jwtExpiryMs;
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiry))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    @Override
    public UserDetails validateToken(String token) {
        String username = extractUsername(token);
        return userDetailsService.loadUserByUsername(username);
    }

    // extract the username from the token
    private String extractUsername(String token) {
        Claims claims = Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody();
        return claims.getSubject(); // before we put the username in .setSubject(userDetails.getUsername())
    }

    private Key getSigningKey() {
        byte[] keyBytes = secretKey.getBytes();
        return Keys.hmacShaKeyFor(keyBytes);
    }

    @Override
    public User register(RegisterRequest request) {
        // Check if email already exists
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already registered");
        }

        // Create new user with default USER role
        User newUser = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .build();

        return userRepository.save(newUser);
    }

    @Override
    public UserProfileResponse getUserProfile(UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with id: " + userId));

        return UserProfileResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .role(user.getRole().name())
                .createdAt(user.getCreatedAt())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .twitterUrl(user.getTwitterUrl())
                .githubUrl(user.getGithubUrl())
                .linkedinUrl(user.getLinkedinUrl())
                .websiteUrl(user.getWebsiteUrl())
                .location(user.getLocation())
                .build();
    }
}
