package com.mehrdad.SafePost.controllers;

import com.mehrdad.SafePost.services.FileStorageService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/files")
@RequiredArgsConstructor
@Slf4j
public class FileController {

    private final FileStorageService fileStorageService;

    @PostMapping("/covers")
    public ResponseEntity<Map<String, String>> uploadCoverImage(
            @RequestParam("file") MultipartFile file) {
        try {
            if (!fileStorageService.isValidImage(file)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid image file. Allowed formats: JPG, PNG, GIF, WebP. Max size: 5MB"));
            }

            String filename = fileStorageService.storeCoverImage(file);
            String url = "/api/v1/files/covers/" + filename;

            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("url", url);
            response.put("size", String.valueOf(file.getSize()));
            response.put("contentType", file.getContentType());

            log.info("Cover image uploaded successfully: {}", filename);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Failed to upload cover image", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload image"));
        }
    }

    @GetMapping("/covers/{filename:.+}")
    public ResponseEntity<Resource> serveCoverImage(@PathVariable String filename) {
        try {
            Resource resource = fileStorageService.loadCoverImage(filename);

            // Determine content type
            String contentType = "image/jpeg"; // Default
            if (filename.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (filename.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            } else if (filename.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=31536000") // Cache for 1 year
                    .body(resource);

        } catch (IOException e) {
            log.error("Failed to load cover image: {}", filename, e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/covers/{filename:.+}")
    public ResponseEntity<Void> deleteCoverImage(@PathVariable String filename) {
        try {
            fileStorageService.deleteCoverImage(filename);
            log.info("Cover image deleted successfully: {}", filename);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            log.error("Failed to delete cover image: {}", filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @PostMapping("/avatars")
    public ResponseEntity<Map<String, String>> uploadAvatar(
            @RequestParam("file") MultipartFile file) {
        try {
            if (!fileStorageService.isValidImage(file)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid image file. Allowed formats: JPG, PNG, GIF, WebP. Max size: 5MB"));
            }

            String filename = fileStorageService.storeAvatar(file);
            String url = "/api/v1/files/avatars/" + filename;

            Map<String, String> response = new HashMap<>();
            response.put("filename", filename);
            response.put("url", url);
            response.put("size", String.valueOf(file.getSize()));
            response.put("contentType", file.getContentType());

            log.info("Avatar uploaded successfully: {}", filename);
            return ResponseEntity.ok(response);

        } catch (IOException e) {
            log.error("Failed to upload avatar", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to upload avatar"));
        }
    }

    @GetMapping("/avatars/{filename:.+}")
    public ResponseEntity<Resource> serveAvatar(@PathVariable String filename) {
        try {
            Resource resource = fileStorageService.loadAvatar(filename);

            // Determine content type
            String contentType = "image/jpeg"; // Default
            if (filename.toLowerCase().endsWith(".png")) {
                contentType = "image/png";
            } else if (filename.toLowerCase().endsWith(".gif")) {
                contentType = "image/gif";
            } else if (filename.toLowerCase().endsWith(".webp")) {
                contentType = "image/webp";
            }

            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType(contentType))
                    .header(HttpHeaders.CACHE_CONTROL, "max-age=31536000") // Cache for 1 year
                    .body(resource);

        } catch (IOException e) {
            log.error("Failed to load avatar: {}", filename, e);
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/avatars/{filename:.+}")
    public ResponseEntity<Void> deleteAvatar(@PathVariable String filename) {
        try {
            fileStorageService.deleteAvatar(filename);
            log.info("Avatar deleted successfully: {}", filename);
            return ResponseEntity.noContent().build();
        } catch (IOException e) {
            log.error("Failed to delete avatar: {}", filename, e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
