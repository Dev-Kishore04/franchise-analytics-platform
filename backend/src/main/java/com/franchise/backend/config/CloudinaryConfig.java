package com.franchise.backend.config;

import com.cloudinary.Cloudinary;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.Map;

@Configuration
public class CloudinaryConfig {

    @Bean
    public Cloudinary cloudinary() {
        return new Cloudinary(Map.of(
            "cloud_name", "dsvkoeoti",
            "api_key", "183334749845933",
            "api_secret", "YMlluzgKiMph3ebymUQJAk9aO3E"
        ));
    }
}
