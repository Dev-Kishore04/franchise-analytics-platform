package com.franchise.backend.dto;
import java.time.LocalDate;

public class BranchRevenueDTO {

    private Long branchId;
    private LocalDate date;
    private Double revenue;

    public BranchRevenueDTO(Long branchId, LocalDate date, Double revenue) {
        this.branchId = branchId;
        this.date = date;
        this.revenue = revenue;
    }

    public Long getBranchId() { return branchId; }
    public LocalDate getDate() { return date; }
    public Double getRevenue() { return revenue; }
}