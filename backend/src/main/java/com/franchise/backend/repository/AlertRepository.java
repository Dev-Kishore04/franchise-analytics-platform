package com.franchise.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.franchise.backend.entity.Alert;

public interface AlertRepository extends JpaRepository<Alert, Long> {
    List<Alert> findByBranchId(Long branchId);
    List<Alert> findByStatus(String status);
    List<Alert> findByStatusNot(String status);
    long countByStatus(String status);
    List<Alert> findAllByOrderByCreatedAtDesc();
    boolean existsByBranchIdAndProductIdAndAlertTypeAndStatus(
        Long branchId,
        Long productId,
        String alertType,
        String status
    );
    void deleteByBranchIdAndProductIdAndAlertTypeAndStatus(
        Long branchId,
        Long productId,
        String alertType,
        String status
    );
    Optional<Alert> findByBranchIdAndProductIdAndAlertTypeAndStatus(
        Long branchId,
        Long productId,
        String alertType,
        String status
    );
}
