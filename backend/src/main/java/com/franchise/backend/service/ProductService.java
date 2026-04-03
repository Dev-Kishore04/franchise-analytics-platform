package com.franchise.backend.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.franchise.backend.dto.ProductRequestDTO;
import com.franchise.backend.dto.ProductResponseDTO;
import com.franchise.backend.entity.Branch;
import com.franchise.backend.entity.Inventory;
import com.franchise.backend.entity.Product;
import com.franchise.backend.repository.BranchRepository;
import com.franchise.backend.repository.InventoryRepository;
import com.franchise.backend.repository.ProductRepository;

@Service
@Transactional
public class ProductService {

    private final ProductRepository productRepository;
    private final CloudinaryService cloudinaryService;
    private final BranchRepository branchRepository;
    private final InventoryRepository inventoryRepository;

    public ProductService(ProductRepository productRepository,
                          CloudinaryService cloudinaryService,
                          BranchRepository branchRepository,
                          InventoryRepository inventoryRepository) {
        this.productRepository   = productRepository;
        this.cloudinaryService   = cloudinaryService;
        this.branchRepository    = branchRepository;
        this.inventoryRepository = inventoryRepository;
    }

    private ProductResponseDTO toDTO(Product p) {
        return new ProductResponseDTO(
                p.getId(), p.getName(), p.getCategory(), p.getPrice(),
                p.getStatus(), p.getSku(), p.getDescription(), p.getImageUrl()
        );
    }

    private String generateSku(String category) {

        String prefix = switch (category) {
            case "Beverage"    -> "BE";
            case "Main Course" -> "MC";
            case "Dessert"     -> "DE";
            case "Side Dish"   -> "SD";
            default            -> "PR";
        };

        long count = productRepository.countByCategory(category) + 1;

        return prefix + "-" + String.format("%04d", count);
    }

    public ProductResponseDTO createProduct(ProductRequestDTO request, MultipartFile image) {

        Product product = new Product();

        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStatus(request.getStatus() != null ? request.getStatus() : "Available");
        product.setSku(generateSku(request.getCategory()));
        product.setDescription(request.getDescription());

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            product.setImageUrl(imageUrl);
        }

        productRepository.save(product);

        // Auto-create a zero-stock inventory row for every existing branch
        // so the product is immediately visible in the Inventory page.
        List<Branch> branches = branchRepository.findAll();
        for (Branch branch : branches) {
            Inventory inventory = new Inventory();
            inventory.setProduct(product);
            inventory.setBranch(branch);
            inventory.setStockQuantity(0);
            inventory.setLowStockThreshold(10);
            inventoryRepository.save(inventory);
        }

        return toDTO(product);
    }

    public List<ProductResponseDTO> getAllProducts() {
        return productRepository.findAll().stream().map(this::toDTO).toList();
    }

    public ProductResponseDTO getProductById(Long id) {
        return toDTO(productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found")));
    }

    public ProductResponseDTO updateProduct(Long id, ProductRequestDTO request, MultipartFile image) {

        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));

        product.setName(request.getName());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setStatus(request.getStatus());
        product.setDescription(request.getDescription());

        if (image != null && !image.isEmpty()) {
            String imageUrl = cloudinaryService.uploadImage(image);
            product.setImageUrl(imageUrl);
        }

        productRepository.save(product);

        return toDTO(product);
    }

    public List<ProductResponseDTO> getProductsByCategory(String category) {
        return productRepository.findByCategory(category).stream().map(this::toDTO).toList();
    }

    public void deleteProduct(Long id) {
        // Remove all inventory rows for this product first to avoid
        // a foreign-key constraint violation when the product row is deleted.
        inventoryRepository.deleteByProductId(id);
        productRepository.deleteById(id);
    }
}

