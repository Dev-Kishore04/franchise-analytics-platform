package com.franchise.backend.dto;
import java.time.LocalDateTime;
import lombok.*;
@Getter @AllArgsConstructor
public class OrderResponseDTO {
    private Long orderId;
    private String orderNumber;
    private Double totalAmount;
    private String paymentMethod;
    private LocalDateTime createdAt;
}
