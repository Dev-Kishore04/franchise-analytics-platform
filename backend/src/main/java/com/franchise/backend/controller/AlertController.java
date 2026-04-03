package com.franchise.backend.controller;

import java.util.List;
import org.springframework.web.bind.annotation.*;
import com.franchise.backend.dto.AlertResponseDTO;
import com.franchise.backend.service.AlertService;

@RestController
@RequestMapping("/api/alerts")
public class AlertController {

    private final AlertService alertService;

    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public List<AlertResponseDTO> getAllAlerts(
            @RequestParam(required = false) String status) {
        if (status != null) return alertService.getAlertsByStatus(status);
        return alertService.getAllAlerts();
    }

    @GetMapping("/branch/{branchId}")
    public List<AlertResponseDTO> getAlertsByBranch(@PathVariable Long branchId) {
        return alertService.getAlertsByBranch(branchId);
    }

    @PutMapping("/{id}/resolve")
    public void resolveAlert(@PathVariable Long id) {
        alertService.resolveAlert(id);
    }
}
