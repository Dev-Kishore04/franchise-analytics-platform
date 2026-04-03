package com.franchise.backend.service;

import java.util.ArrayList;
import java.util.List;
import org.springframework.stereotype.Service;
import com.franchise.backend.dto.BranchRequestDTO;
import com.franchise.backend.dto.BranchResponseDTO;
import com.franchise.backend.entity.Branch;
import com.franchise.backend.entity.Inventory;
import com.franchise.backend.entity.Product;
import com.franchise.backend.entity.User;
import com.franchise.backend.repository.BranchRepository;
import com.franchise.backend.repository.InventoryRepository;
import com.franchise.backend.repository.ProductRepository;
import com.franchise.backend.repository.UserRepository;

@Service
public class BranchService {

    private final BranchRepository branchRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final InventoryRepository inventoryRepository;

    public BranchService(BranchRepository branchRepository, UserRepository userRepository, ProductRepository productRepository, InventoryRepository inventoryRepository) {
        this.branchRepository = branchRepository;
        this.userRepository = userRepository;
        this.productRepository = productRepository;
        this.inventoryRepository = inventoryRepository;
    }

    private String generateBranchCode() {
        long count = branchRepository.count() + 1;
        return String.format("FR-%04d", count + 1000);
    }

    private BranchResponseDTO toDTO(Branch b) {
        String managerName = b.getManager() != null ? b.getManager().getName() : null;
        return new BranchResponseDTO(
                b.getId(), b.getName(), b.getLocation(),
                b.getBranchCode(), b.getStatus(), managerName
        );
    }

    public BranchResponseDTO createBranch(BranchRequestDTO request) {

        branchRepository.findByName(request.getName()).ifPresent(b -> {
            throw new RuntimeException("Branch already exists");
        });

        Branch branch = new Branch();
        branch.setName(request.getName());
        branch.setLocation(request.getLocation());
        branch.setStatus(request.getStatus() != null ? request.getStatus() : "Pending");
        branch.setBranchCode(generateBranchCode());

        User manager = null;

        if (request.getManagerId() != null) {
            manager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found"));

            branch.setManager(manager);
        }

        Branch saved = branchRepository.save(branch);

        // assign branch to manager
        if (manager != null) {
            manager.setBranch(saved);
            userRepository.save(manager);
        }

        // 🔹 CREATE INVENTORY FOR ALL PRODUCTS (stock = 0)
        List<Product> products = productRepository.findAll();
        List<Inventory> inventoryList = new ArrayList<>();

        for (Product product : products) {
            Inventory inventory = new Inventory();
            inventory.setBranch(saved);
            inventory.setProduct(product);
            inventory.setStockQuantity(0);
            inventory.setLowStockThreshold(10); // default threshold

            inventoryList.add(inventory);
        }

        inventoryRepository.saveAll(inventoryList);

        return toDTO(saved);
    }
    
    public BranchResponseDTO updateBranch(Long id, BranchRequestDTO request) {
        Branch branch = branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        // Clear old manager's branch_id
        if (branch.getManager() != null) {
            User oldManager = branch.getManager();
            oldManager.setBranch(null);
            userRepository.save(oldManager);
        }

        branch.setName(request.getName());
        branch.setLocation(request.getLocation());
        branch.setStatus(request.getStatus());

        if (request.getManagerId() != null) {
            User newManager = userRepository.findById(request.getManagerId())
                    .orElseThrow(() -> new RuntimeException("Manager not found"));
            branch.setManager(newManager);
            Branch saved = branchRepository.save(branch);
            newManager.setBranch(saved);
            userRepository.save(newManager);
            return toDTO(saved);
        } else {
            branch.setManager(null);
            return toDTO(branchRepository.save(branch));
        }
    }

    public List<BranchResponseDTO> getAllBranches() {
        return branchRepository.findAll().stream().map(this::toDTO).toList();
    }

    public BranchResponseDTO getBranchById(Long id) {
        return toDTO(branchRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Branch not found")));
    }


    public void deleteBranch(Long id) {
        branchRepository.deleteById(id);
    }
}
