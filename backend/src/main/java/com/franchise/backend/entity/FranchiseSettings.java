package com.franchise.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "franchise_settings")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class FranchiseSettings {

    @Id
    private Long id = 1L; // singleton row — always id=1

    private String franchiseName;
    private String currency;
    private String timezone;

    private Integer lowStockThresholdPct;  // default 15
    private Integer salesDipWarningPct;    // default 8
    private Integer anomalySensitivity;   // 0-100

    private Boolean autoRecommendEnabled;
    private Boolean emailInsightsEnabled;
}
