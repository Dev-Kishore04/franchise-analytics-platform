package com.franchise.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import com.franchise.backend.entity.AIInsight;

public interface AIInsightRepository extends JpaRepository<AIInsight, Long> {
    List<AIInsight> findByBranchId(Long branchId);
    List<AIInsight> findAllByOrderByCreatedAtDesc();
    boolean existsByBranchIdAndCategoryAndInsightText(
        Long branchId,
        String category,
        String insightText
    );
    boolean existsByBranchId(Long branchId);

    long count();

    @Modifying
    @Transactional
    @Query("DELETE FROM AIInsight")
    void deleteAllInsights();

    @Modifying
    @Transactional
    @Query("DELETE FROM AIInsight i WHERE i.createdAt < :expiry")
    void deleteOlderThan(LocalDateTime expiry);
}
