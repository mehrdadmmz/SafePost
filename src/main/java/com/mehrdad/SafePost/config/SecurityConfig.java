package com.mehrdad.SafePost.config;

import com.mehrdad.SafePost.domain.entities.User;
import com.mehrdad.SafePost.repositories.UserRepository;
import com.mehrdad.SafePost.security.BlogUserDetails;
import com.mehrdad.SafePost.security.BlogUserDetailsService;
import com.mehrdad.SafePost.security.JwtAuthenticatrionFilter;
import com.mehrdad.SafePost.services.AuthenticationService;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Bean
    public JwtAuthenticatrionFilter jwtAuthenticatrionFilter(AuthenticationService authenticationService) {
        return new JwtAuthenticatrionFilter(authenticationService);
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {

        // create a test user in the db if that user does not already exist
        BlogUserDetailsService blogUserDetailsService = new BlogUserDetailsService(userRepository);

        String email = "user@test.com";
        userRepository.findByEmail(email).orElseGet(() -> {
            User newUSer = User.builder()
                    .name("Test User")
                    .email(email)
                    .password(passwordEncoder().encode("password"))
                    .build();
            return userRepository.save(newUSer);
        });

        return blogUserDetailsService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticatrionFilter jwtAuthenticatrionFilter) throws  Exception {
        http
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/posts/**").permitAll() // any calls to the posts api will be permitted
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll() // any calls to the categories api will be permitted
                        .requestMatchers(HttpMethod.GET, "/api/v1/tags/**").permitAll() // any calls to the tags api will be permitted
                        .anyRequest().authenticated() // anything else requires authentication
                )
                .csrf(csrf -> csrf.disable()) // disabling csrf tokens
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS) // No HTTP sessions stored on the server. Each request must carry its own authentication (like a JWT token).
                ).addFilterBefore(jwtAuthenticatrionFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    // @Bean -->
    // When Spring starts, it calls this method.
    // It gets back a PasswordEncoder instance.
    // That instance is registered in the container.
    // Later, if any class has private final PasswordEncoder passwordEncoder; -→ Spring auto-injects it.
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
