package com.mehrdad.SafePost.services;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileStorageService {

    /**
     * Store a cover image file and return the filename
     * @param file The file to store
     * @return The unique filename
     * @throws IOException if file cannot be stored
     */
    String storeCoverImage(MultipartFile file) throws IOException;

    /**
     * Load a cover image file as a Resource
     * @param filename The filename to load
     * @return The file as a Resource
     * @throws IOException if file cannot be loaded
     */
    Resource loadCoverImage(String filename) throws IOException;

    /**
     * Delete a cover image file
     * @param filename The filename to delete
     * @throws IOException if file cannot be deleted
     */
    void deleteCoverImage(String filename) throws IOException;

    /**
     * Validate if the file is a valid image
     * @param file The file to validate
     * @return true if valid, false otherwise
     */
    boolean isValidImage(MultipartFile file);

    /**
     * Store an avatar image file and return the filename
     * @param file The file to store
     * @return The unique filename
     * @throws IOException if file cannot be stored
     */
    String storeAvatar(MultipartFile file) throws IOException;

    /**
     * Load an avatar image file as a Resource
     * @param filename The filename to load
     * @return The file as a Resource
     * @throws IOException if file cannot be loaded
     */
    Resource loadAvatar(String filename) throws IOException;

    /**
     * Delete an avatar image file
     * @param filename The filename to delete
     * @throws IOException if file cannot be deleted
     */
    void deleteAvatar(String filename) throws IOException;
}
