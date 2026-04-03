package com.franchise.backend.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class OrderRequestDTO {

    private Long branchId;
    private Long staffId;
    private String paymentMethod;
    private List<OrderItemRequestDTO> items;

}