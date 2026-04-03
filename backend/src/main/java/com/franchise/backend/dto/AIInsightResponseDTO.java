package com.franchise.backend.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIInsightResponseDTO {

    private List<InsightDTO> insights;
    private List<RecommendationDTO> recommendations;

}