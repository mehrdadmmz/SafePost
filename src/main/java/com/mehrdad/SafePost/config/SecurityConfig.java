package com.mehrdad.SafePost.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws  Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.GET, "/api/v1/posts/**").permitAll() // any calls to the posts api will be permitted
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll() // any calls to the categories api will be permitted
                        .requestMatchers(HttpMethod.GET, "/api/v1/tags/**").permitAll() // any calls to the tags api will be permitted
                        .anyRequest().authenticated() // anything else requires authentication
                )
                .csrf(csrf -> csrf.disable()) // disabling csrf tokens
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No HTTP sessions stored on the server. Each request must carry its own authentication (like a JWT token).
                );
        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        // Passwords should never be stored in plain text
        // This bean creates a PasswordEncoder (by default uses bcrypt).
        // When saving users, we encode their password. When logging in, Spring compares encoded values.
        return PasswordEncoderFactories.createDelegatingPasswordEncoder();
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        // Exposes the AuthenticationManager, which is the core auth engine in Spring.
        // Other components (like login endpoints, JWT filters) will use this to authenticate users against your UserDetailsService.
        return config.getAuthenticationManager();
     }
}
