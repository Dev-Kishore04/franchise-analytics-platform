package com.franchise.backend.dto;
import lombok.*;
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class SettingsDTO {
    private String franchiseName;
    private String currency;
    private String timezone;
    private Integer lowStockThresholdPct;
    private Integer salesDipWarningPct;
    private Integer anomalySensitivity;
    private Boolean autoRecommendEnabled;
    private Boolean emailInsightsEnabled;
}
