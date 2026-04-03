package com.franchise.backend.dto;
import lombok.*;
@Getter @Setter
public class ProductRequestDTO {
    private String name;
    private String category;
    private Double price;
    private String status;
    private String description;
    private String imageUrl;
}
