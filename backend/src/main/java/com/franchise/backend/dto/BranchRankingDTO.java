package com.franchise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BranchRankingDTO {

    private Long branchId;
    private String branchName;
    private Double revenue;

    public Long getBranchId() { return branchId; }
    public String getBranchName() { return branchName; }
    public Double getRevenue() { return revenue; }
}
