package com.franchise.backend.repository;

import java.time.LocalDate;
import java.util.Optional;
import com.franchise.backend.entity.AnalyticsCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface AnalyticsCacheRepository extends JpaRepository<AnalyticsCache, Long> {

    Optional<AnalyticsCache> findByBranchIdAndDate(Long branchId, LocalDate date);

}
