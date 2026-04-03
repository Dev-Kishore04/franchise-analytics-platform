package com.franchise.backend.service;

import com.cloudinary.Cloudinary;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Service
public class CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryService(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    public String uploadImage(MultipartFile file) {
        try {

            @SuppressWarnings("unchecked")
            Map<String, Object> uploadResult =
                (Map<String, Object>) cloudinary.uploader().upload(file.getBytes(), Map.of());
                System.out.println("Uploading image to Cloudinary...ft-cloudserv");
            return uploadResult.get("secure_url").toString();

        } catch (Exception e) {
            throw new RuntimeException("Image upload failed", e);
        }
    }
}