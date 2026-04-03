package com.franchise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BranchOrderValueDTO {

    private Long branchId;
    private String branchName;
    private Double avgOrderValue;

}