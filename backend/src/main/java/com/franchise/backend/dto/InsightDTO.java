package com.franchise.backend.dto;
import lombok.*;

@Getter
@Setter
public class InsightDTO {

    private Long branchId;

    private String metric;

    private Double value;

    private String description;

    private String recommendation;

    private String impactLevel;

    private String category;

}