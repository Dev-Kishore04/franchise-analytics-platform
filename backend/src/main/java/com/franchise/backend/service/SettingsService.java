package com.franchise.backend.service;

import com.franchise.backend.dto.SettingsDTO;
import com.franchise.backend.entity.FranchiseSettings;
import com.franchise.backend.repository.FranchiseSettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final FranchiseSettingsRepository settingsRepository;

    public SettingsService(FranchiseSettingsRepository settingsRepository) {
        this.settingsRepository = settingsRepository;
    }

    public SettingsDTO getSettings() {
        FranchiseSettings s = settingsRepository.findById(1L).orElseGet(() -> {
            FranchiseSettings defaults = new FranchiseSettings();
            defaults.setId(1L);
            defaults.setFranchiseName("Executive Insight Global");
            defaults.setCurrency("USD - US Dollar ($)");
            defaults.setTimezone("(GMT-05:00) Eastern Time");
            defaults.setLowStockThresholdPct(15);
            defaults.setSalesDipWarningPct(8);
            defaults.setAnomalySensitivity(75);
            defaults.setAutoRecommendEnabled(true);
            defaults.setEmailInsightsEnabled(true);
            return settingsRepository.save(defaults);
        });
        return toDTO(s);
    }

    public SettingsDTO updateSettings(SettingsDTO dto) {
        FranchiseSettings s = settingsRepository.findById(1L).orElse(new FranchiseSettings());
        s.setId(1L);
        s.setFranchiseName(dto.getFranchiseName());
        s.setCurrency(dto.getCurrency());
        s.setTimezone(dto.getTimezone());
        s.setLowStockThresholdPct(dto.getLowStockThresholdPct());
        s.setSalesDipWarningPct(dto.getSalesDipWarningPct());
        s.setAnomalySensitivity(dto.getAnomalySensitivity());
        s.setAutoRecommendEnabled(dto.getAutoRecommendEnabled());
        s.setEmailInsightsEnabled(dto.getEmailInsightsEnabled());
        settingsRepository.save(s);
        return toDTO(s);
    }

    private SettingsDTO toDTO(FranchiseSettings s) {
        return new SettingsDTO(
                s.getFranchiseName(), s.getCurrency(), s.getTimezone(),
                s.getLowStockThresholdPct(), s.getSalesDipWarningPct(),
                s.getAnomalySensitivity(), s.getAutoRecommendEnabled(), s.getEmailInsightsEnabled()
        );
    }
}
