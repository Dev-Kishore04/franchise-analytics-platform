package com.franchise.backend.service;

import java.time.LocalDateTime;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import com.franchise.backend.repository.AIInsightRepository;

@Service
public class InsightCleanupScheduler {

    private final AIInsightRepository insightRepository;

    public InsightCleanupScheduler(AIInsightRepository insightRepository) {
        this.insightRepository = insightRepository;
    }

    @Scheduled(fixedRate = 60 * 60 * 1000)
    public void cleanupOldInsights() {

        LocalDateTime expiry = LocalDateTime.now().minusHours(24);

        insightRepository.deleteOlderThan(expiry);

    }
}