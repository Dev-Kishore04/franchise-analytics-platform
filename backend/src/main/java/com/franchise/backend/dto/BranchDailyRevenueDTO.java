package com.franchise.backend.dto;

import java.time.LocalDate;

public class BranchDailyRevenueDTO {

    private Long branchId;
    private String branchName;
    private LocalDate date;
    private Double revenue;

    public BranchDailyRevenueDTO(Long branchId, String branchName, LocalDate date, Double revenue) {
        this.branchId = branchId;
        this.branchName = branchName;
        this.date = date;
        this.revenue = revenue;
    }

    public Long getBranchId() { return branchId; }
    public String getBranchName() { return branchName; }
    public LocalDate getDate() { return date; }
    public Double getRevenue() { return revenue; }
}