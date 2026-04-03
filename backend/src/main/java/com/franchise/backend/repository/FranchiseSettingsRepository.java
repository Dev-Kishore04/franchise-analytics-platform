package com.franchise.backend.repository;

import com.franchise.backend.entity.FranchiseSettings;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FranchiseSettingsRepository extends JpaRepository<FranchiseSettings, Long> {
}
