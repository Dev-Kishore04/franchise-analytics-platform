package com.franchise.backend.dto;

public class BranchInsightResponseDTO {

    private Long branchId;
    private String branchName;
    private Integer rank;
    private Double revenue;
    private Long orders;
    private Double avgOrderValue;
    private Long productDiversity;

    private Double topBranchRevenue;
    private Long topBranchOrders;
    private Double topBranchAOV;
    private Long topBranchProductTypes;

    private String insight;
    private String recommendation;

    public BranchInsightResponseDTO(Long branchId, String branchName, Integer rank,
                                    Double revenue, Long orders, Double avgOrderValue,
                                    Long productDiversity, Double topBranchRevenue,
                                    Long topBranchOrders, Double topBranchAOV,
                                    Long topBranchProductTypes, String insight,
                                    String recommendation) {
        this.branchId = branchId;
        this.branchName = branchName;
        this.rank = rank;
        this.revenue = revenue;
        this.orders = orders;
        this.avgOrderValue = avgOrderValue;
        this.productDiversity = productDiversity;
        this.topBranchRevenue = topBranchRevenue;
        this.topBranchOrders = topBranchOrders;
        this.topBranchAOV = topBranchAOV;
        this.topBranchProductTypes = topBranchProductTypes;
        this.insight = insight;
        this.recommendation = recommendation;
    }

    public Long getBranchId() { return branchId; }
    public String getBranchName() { return branchName; }
    public Integer getRank() { return rank; }
    public Double getRevenue() { return revenue; }
    public Long getOrders() { return orders; }
    public Double getAvgOrderValue() { return avgOrderValue; }
    public Long getProductDiversity() { return productDiversity; }
    public Double getTopBranchRevenue() { return topBranchRevenue; }
    public Long getTopBranchOrders() { return topBranchOrders; }
    public Double getTopBranchAOV() { return topBranchAOV; }
    public Long getTopBranchProductTypes() { return topBranchProductTypes; }
    public String getInsight() { return insight; }
    public String getRecommendation() { return recommendation; }
}
