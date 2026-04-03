package com.franchise.backend.controller;

import org.springframework.web.bind.annotation.*;
import com.franchise.backend.dto.SettingsDTO;
import com.franchise.backend.service.SettingsService;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public SettingsDTO getSettings() {
        return settingsService.getSettings();
    }

    @PutMapping
    public SettingsDTO updateSettings(@RequestBody SettingsDTO dto) {
        return settingsService.updateSettings(dto);
    }
}
