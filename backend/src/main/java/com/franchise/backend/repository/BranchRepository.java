package com.franchise.backend.repository;

import com.franchise.backend.entity.Branch;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BranchRepository extends JpaRepository<Branch, Long> {
    Optional<Branch> findByName(String name);
    Optional<Branch> findByBranchCode(String branchCode);
    long count();
}
