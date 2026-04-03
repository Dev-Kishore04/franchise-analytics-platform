package com.franchise.backend.service;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.franchise.backend.dto.InventoryResponseDTO;
import com.franchise.backend.dto.InventoryUpdateRequestDTO;
import com.franchise.backend.entity.Alert;
import com.franchise.backend.entity.Branch;
import com.franchise.backend.entity.Inventory;
import com.franchise.backend.entity.Product;
import com.franchise.backend.repository.AlertRepository;
import com.franchise.backend.repository.BranchRepository;
import com.franchise.backend.repository.InventoryRepository;
import com.franchise.backend.repository.ProductRepository;

@Service
@Transactional
public class InventoryService {

    private final InventoryRepository inventoryRepository;
    private final BranchRepository branchRepository;
    private final ProductRepository productRepository;
    private final AlertRepository alertRepository;

    public InventoryService(
            InventoryRepository inventoryRepository,
            BranchRepository branchRepository,
            ProductRepository productRepository,
            AlertRepository alertRepository
    ){
        this.inventoryRepository = inventoryRepository;
        this.branchRepository = branchRepository;
        this.productRepository = productRepository;
        this.alertRepository = alertRepository;
    }

    public List<InventoryResponseDTO> getInventoryByBranch(Long branchId){

        return inventoryRepository.findByBranchId(branchId)
                .stream()
                .map(i -> new InventoryResponseDTO(
                        i.getId(),
                        i.getBranch().getId(),
                        i.getProduct().getId(),
                        i.getStockQuantity(),
                        i.getLowStockThreshold()
                ))
                .toList();
    }

    public InventoryResponseDTO updateInventory(InventoryUpdateRequestDTO request){

        Branch branch = branchRepository.findById(request.getBranchId())
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Inventory inventory =
                inventoryRepository
                        .findByBranchIdAndProductId(
                                request.getBranchId(),
                                request.getProductId()
                        )
                        .orElse(new Inventory());

        inventory.setBranch(branch);
        inventory.setProduct(product);
        inventory.setStockQuantity(request.getStockQuantity());
        inventory.setLowStockThreshold(request.getLowStockThreshold());

        inventoryRepository.save(inventory);



        Optional<Alert> existingAlert = alertRepository
                .findByBranchIdAndProductIdAndAlertTypeAndStatus(
                        branch.getId(),
                        product.getId(),
                        "Inventory",
                        "UNRESOLVED"
                );

        if(inventory.getStockQuantity() <= inventory.getLowStockThreshold()){

        if(existingAlert.isPresent()){

                Alert alert = existingAlert.get();

                alert.setMessage(
                product.getName() + " stock is low (" +
                inventory.getStockQuantity() + " remaining)"
                );

                alertRepository.save(alert);

        } else {

                Alert alert = new Alert();
                alert.setBranch(branch);
                alert.setProduct(product);
                alert.setAlertType("Inventory");
                alert.setTitle("Low Stock Warning: " +product.getName());
                alert.setMessage(
                " stock is low (" +
                inventory.getStockQuantity() + " remaining)"
                );
                alert.setSeverity("HIGH");
                alert.setStatus("UNRESOLVED");

                alertRepository.save(alert);
        }

        }else{

        alertRepository.deleteByBranchIdAndProductIdAndAlertTypeAndStatus(
                branch.getId(),
                product.getId(),
                "Inventory",
                "UNRESOLVED"
        );
        }
        return new InventoryResponseDTO(
                inventory.getId(),
                branch.getId(),
                product.getId(),
                inventory.getStockQuantity(),
                inventory.getLowStockThreshold()
        );
    }
}
