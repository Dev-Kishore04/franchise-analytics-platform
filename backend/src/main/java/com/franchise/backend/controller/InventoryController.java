package com.franchise.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.franchise.backend.dto.InventoryResponseDTO;
import com.franchise.backend.dto.InventoryUpdateRequestDTO;
import com.franchise.backend.service.InventoryService;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService){
        this.inventoryService = inventoryService;
    }

    @GetMapping("/branch/{branchId}")
    public List<InventoryResponseDTO> getInventory(
            @PathVariable Long branchId
    ){
        return inventoryService.getInventoryByBranch(branchId);
    }

    @PutMapping("/update")
    public InventoryResponseDTO updateInventory(
            @RequestBody InventoryUpdateRequestDTO request
    ){
        return inventoryService.updateInventory(request);
    }
}
