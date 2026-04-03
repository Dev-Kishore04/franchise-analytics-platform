package com.franchise.backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.franchise.backend.dto.InsightResponseDTO;
import com.franchise.backend.dto.InsightStatusUpdateDTO;
import com.franchise.backend.service.InsightService;

@RestController
@RequestMapping("/api/insights")
public class InsightController {

    private final InsightService insightService;

    public InsightController(InsightService insightService) {
        this.insightService = insightService;
    }
    
    @PostMapping("/generate")
    public ResponseEntity<String> generateInsights() {
        insightService.generateInsights();
        return ResponseEntity.ok("Insights generated successfully");
    }

    @GetMapping
    public List<InsightResponseDTO> getInsights() {
        return insightService.getAllInsights();
    }

    @GetMapping("/branch/{branchId}")
    public List<InsightResponseDTO> getBranchInsights(@PathVariable Long branchId) {
        return insightService.getInsightsByBranch(branchId);
    }

    @PatchMapping("/{id}/status")
    public InsightResponseDTO updateStatus(
            @PathVariable Long id,
            @RequestBody InsightStatusUpdateDTO dto) {
        return insightService.updateInsightStatus(id, dto.getStatus());
    }

    @DeleteMapping("/delete-all")
    public ResponseEntity<String> deleteAllInsights() {

        insightService.deleteAllInsights();

        return ResponseEntity.ok("All insights deleted");
    }
    @PostMapping("/recommendation")
    public ResponseEntity<Map<String, String>> getRecommendation(
            @RequestBody Map<String, Object> request) {

        String context = (String) request.get("context");

        @SuppressWarnings("unchecked")
        Map<String, Object> data =
                (Map<String, Object>) request.get("data");

        String recommendation =
                insightService.generateRecommendation(context, data);

        return ResponseEntity.ok(Map.of("message", recommendation));
    }
}
