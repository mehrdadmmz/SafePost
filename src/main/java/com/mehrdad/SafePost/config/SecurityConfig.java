package com.mehrdad.SafePost.config;

import com.mehrdad.SafePost.repositories.UserRepository;
import com.mehrdad.SafePost.security.BlogUserDetailsService;
import com.mehrdad.SafePost.security.JwtAuthenticatrionFilter;
import com.mehrdad.SafePost.services.AuthenticationService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Value("${cors.allowed.origins:http://localhost:5173}")
    private String corsAllowedOrigins;

    @Bean
    public JwtAuthenticatrionFilter jwtAuthenticatrionFilter(AuthenticationService authenticationService) {
        return new JwtAuthenticatrionFilter(authenticationService);
    }

    @Bean
    public UserDetailsService userDetailsService(UserRepository userRepository) {
        // Return the UserDetailsService without creating test users
        return new BlogUserDetailsService(userRepository);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();

        // Split comma-separated origins from environment variable
        String[] origins = corsAllowedOrigins.split(",");
        configuration.setAllowedOrigins(Arrays.asList(origins));

        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtAuthenticatrionFilter jwtAuthenticatrionFilter,
            CorsConfigurationSource corsConfigurationSource) throws  Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/v1/files/covers/**").permitAll() // allow public access to cover images
                        .requestMatchers("/api/v1/files/avatars/**").permitAll() // allow public access to avatars
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/login").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/auth/register").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/users/*/profile").permitAll() // allow public access to view profiles
                        .requestMatchers(HttpMethod.GET, "/api/v1/posts/drafts").authenticated() // user needs to be authenticated in oder to see the drafts
                        .requestMatchers(HttpMethod.GET, "/api/v1/posts/**").permitAll() // any calls to the posts api will be permitted
                        .requestMatchers(HttpMethod.GET, "/api/v1/categories/**").permitAll() // any calls to the categories api will be permitted
                        .requestMatchers(HttpMethod.GET, "/api/v1/tags/**").permitAll() // any calls to the tags api will be permitted
                        .anyRequest().authenticated() // anything else requires authentication
                )
                .csrf(csrf -> csrf.disable()) // disabling csrf tokens
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // No HTTP sessions stored on the server. Each request must carry its own authentication (like a JWT token).
                .addFilterBefore(jwtAuthenticatrionFilter, UsernamePasswordAuthenticationFilter.class);
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
