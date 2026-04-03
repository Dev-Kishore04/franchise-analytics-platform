package com.franchise.backend.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.franchise.backend.entity.Inventory;

@Repository
public interface InventoryRepository extends JpaRepository<Inventory, Long> {

    List<Inventory> findByBranchId(Long branchId);
    Optional<Inventory> findByBranchIdAndProductId(Long branchId, Long productId);
    void deleteByProductId(Long productId);

}