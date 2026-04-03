package com.franchise.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class InventoryUpdateRequestDTO {
    private Long branchId;
    private Long productId;
    private Integer stockQuantity;
    private Integer lowStockThreshold;
}
