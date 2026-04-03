package com.franchise.backend.dto;
import java.time.LocalDateTime;
import lombok.*;
@Getter @AllArgsConstructor
public class InsightResponseDTO {
    private Long id;
    private Long branchId;
    private String branchName;
    private String insightText;
    private String recommendationText;
    private String impactLevel;
    private String status;
    private String category;
    private LocalDateTime createdAt;
}
