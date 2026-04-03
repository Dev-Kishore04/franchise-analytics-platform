package com.franchise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class InventoryResponseDTO {
    private Long id;
    private Long branchId;
    private Long productId;
    private Integer stockQuantity;
    private Integer lowStockThreshold;
}
