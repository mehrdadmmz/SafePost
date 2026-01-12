package com.mehrdad.SafePost.services.impl;

import com.mehrdad.SafePost.services.FileStorageService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Arrays;
import java.util.List;
import java.util.UUID;

@Service
@Slf4j
public class FileStorageServiceImpl implements FileStorageService {

    private final Path coverImagesLocation;
    private final Path avatarsLocation;
    private static final long MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
    private static final List<String> ALLOWED_CONTENT_TYPES = Arrays.asList(
            "image/jpeg",
            "image/jpg",
            "image/png",
            "image/gif",
            "image/webp"
    );

    public FileStorageServiceImpl(@Value("${file.upload.dir:uploads/covers}") String uploadDir) throws IOException {
        this.coverImagesLocation = Paths.get(uploadDir).toAbsolutePath().normalize();
        Files.createDirectories(this.coverImagesLocation);

        // Initialize avatars directory
        this.avatarsLocation = Paths.get(uploadDir).getParent().resolve("avatars").toAbsolutePath().normalize();
        Files.createDirectories(this.avatarsLocation);

        log.info("File storage initialized - covers: {}, avatars: {}", this.coverImagesLocation, this.avatarsLocation);
    }

    @Override
    public String storeCoverImage(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }

        if (!isValidImage(file)) {
            throw new IllegalArgumentException("Invalid image file");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID() + extension;

        // Store file
        Path targetLocation = this.coverImagesLocation.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        log.info("Stored cover image: {}", filename);
        return filename;
    }

    @Override
    public Resource loadCoverImage(String filename) throws IOException {
        try {
            Path filePath = this.coverImagesLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new IOException("File not found: " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new IOException("File not found: " + filename, ex);
        }
    }

    @Override
    public void deleteCoverImage(String filename) throws IOException {
        if (filename == null || filename.isEmpty()) {
            return;
        }

        Path filePath = this.coverImagesLocation.resolve(filename).normalize();
        Files.deleteIfExists(filePath);
        log.info("Deleted cover image: {}", filename);
    }

    @Override
    public boolean isValidImage(MultipartFile file) {
        // Check file size
        if (file.getSize() > MAX_FILE_SIZE) {
            log.warn("File too large: {} bytes", file.getSize());
            return false;
        }

        // Check content type
        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_CONTENT_TYPES.contains(contentType.toLowerCase())) {
            log.warn("Invalid content type: {}", contentType);
            return false;
        }

        return true;
    }

    @Override
    public String storeAvatar(MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot store empty file");
        }

        if (!isValidImage(file)) {
            throw new IllegalArgumentException("Invalid image file");
        }

        // Generate unique filename
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : ".jpg";
        String filename = UUID.randomUUID() + extension;

        // Store file
        Path targetLocation = this.avatarsLocation.resolve(filename);
        Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

        log.info("Stored avatar: {}", filename);
        return filename;
    }

    @Override
    public Resource loadAvatar(String filename) throws IOException {
        try {
            Path filePath = this.avatarsLocation.resolve(filename).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                throw new IOException("File not found: " + filename);
            }
        } catch (MalformedURLException ex) {
            throw new IOException("File not found: " + filename, ex);
        }
    }

    @Override
    public void deleteAvatar(String filename) throws IOException {
        if (filename == null || filename.isEmpty()) {
            return;
        }

        Path filePath = this.avatarsLocation.resolve(filename).normalize();
        Files.deleteIfExists(filePath);
        log.info("Deleted avatar: {}", filename);
    }
}
