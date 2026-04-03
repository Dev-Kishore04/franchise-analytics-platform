package com.franchise.backend.dto;
import lombok.*;
@Getter @AllArgsConstructor
public class DashboardResponseDTO {
    private Double totalRevenue;
    private Long totalOrders;
    private Double averageOrderValue;
    private Long totalBranches;
}
