package com.franchise.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.franchise.backend.dto.AlertResponseDTO;
import com.franchise.backend.entity.Alert;
import com.franchise.backend.repository.AlertRepository;

@Service
public class AlertService {

    private final AlertRepository alertRepository;

    public AlertService(AlertRepository alertRepository) {
        this.alertRepository = alertRepository;
    }

    private AlertResponseDTO toDTO(Alert a) {
        return new AlertResponseDTO(
                a.getId(),
                a.getBranch() != null ? a.getBranch().getId() : null,
                a.getBranch() != null ? a.getBranch().getName() : "Unknown",
                a.getAlertType(),
                a.getTitle(),
                a.getMessage(),
                a.getSeverity(),
                a.getStatus(),
                a.getCreatedAt()
        );
    }

    public List<AlertResponseDTO> getAllAlerts() {
        return alertRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toDTO).toList();
    }

    public List<AlertResponseDTO> getAlertsByBranch(Long branchId) {
        return alertRepository.findByBranchId(branchId).stream().map(this::toDTO).toList();
    }

    public List<AlertResponseDTO> getAlertsByStatus(String status) {
        return alertRepository.findByStatus(status).stream().map(this::toDTO).toList();
    }

    public void resolveAlert(Long id) {
        Alert alert = alertRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alert not found"));
        alert.setStatus("RESOLVED");
        alertRepository.save(alert);
    }

    public long countUnresolved() {
        return alertRepository.countByStatus("UNRESOLVED");
    }

//     public void createLowStockAlert(Inventory inventory) {

//     Alert alert = new Alert();

//     alert.setBranch(inventory.getBranch());
//     alert.setAlertType("INVENTORY");

//     alert.setTitle("Low Stock Warning");

//     alert.setMessage(
//         inventory.getProduct().getName() +
//         " stock is low (" +
//         inventory.getStockQuantity() +
//         " remaining)"
//     );

//     alert.setSeverity("WARNING");
//     alert.setStatus("UNRESOLVED");

//     alertRepository.save(alert);
// }
}
