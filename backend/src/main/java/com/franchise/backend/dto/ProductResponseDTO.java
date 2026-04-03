package com.franchise.backend.dto;
import lombok.*;
@Getter @AllArgsConstructor
public class ProductResponseDTO {
    private Long id;
    private String name;
    private String category;
    private Double price;
    private String status;
    private String sku;
    private String description;
    private String imageUrl;
}
