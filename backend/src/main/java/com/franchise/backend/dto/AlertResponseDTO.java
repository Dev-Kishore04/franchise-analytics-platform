package com.franchise.backend.dto;
import java.time.LocalDateTime;
import lombok.*;
@Getter @AllArgsConstructor
public class AlertResponseDTO {
    private Long id;
    private Long branchId;
    private String branchName;
    private String alertType;
    private String title;
    private String message;
    private String severity;
    private String status;
    private LocalDateTime createdAt;
}
