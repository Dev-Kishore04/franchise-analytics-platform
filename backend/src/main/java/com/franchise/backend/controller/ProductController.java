package com.franchise.backend.controller;

import java.util.List;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.franchise.backend.dto.ProductRequestDTO;
import com.franchise.backend.dto.ProductResponseDTO;
import com.franchise.backend.service.ProductService;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService){
        this.productService = productService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponseDTO createProduct(
            @RequestPart("data") ProductRequestDTO request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        System.out.println("REQUEST DATA: " + request);
        System.out.println("IMAGE OBJECT: " + image);
        System.out.println("IMAGE EMPTY: " + (image != null ? image.isEmpty() : "null"));
        System.out.println("IMAGE NAME: " + (image != null ? image.getOriginalFilename() : "null"));
        return productService.createProduct(request, image);
    }

    @GetMapping
    public List<ProductResponseDTO> getAllProducts(){
        return productService.getAllProducts();
    }

    @GetMapping("/category")
    public List<ProductResponseDTO> getProductsByCategory(@RequestParam String category){
        return productService.getProductsByCategory(category);
    }

    @GetMapping("/{id}")
    public ProductResponseDTO getProduct(@PathVariable Long id){
        return productService.getProductById(id);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ProductResponseDTO updateProduct(
            @PathVariable Long id,
            @RequestPart("data") ProductRequestDTO request,
            @RequestPart(value = "image", required = false) MultipartFile image
    ) {
        return productService.updateProduct(id, request, image);
    }

    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable Long id){
        productService.deleteProduct(id);
    }
}
