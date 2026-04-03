package com.franchise.backend.controller;

import java.util.List;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.franchise.backend.dto.BranchRequestDTO;
import com.franchise.backend.dto.BranchResponseDTO;
import com.franchise.backend.service.BranchService;

@RestController
@RequestMapping("/api/branches")
public class BranchController {

    private final BranchService branchService;

    public BranchController(BranchService branchService){
        this.branchService = branchService;
    }

    @PostMapping
    public BranchResponseDTO createBranch(
            @RequestBody BranchRequestDTO request
    ){
        return branchService.createBranch(request);
    }

    @GetMapping
    public List<BranchResponseDTO> getAllBranches(){
        return branchService.getAllBranches();
    }

    @GetMapping("/{id}")
    public BranchResponseDTO getBranch(@PathVariable Long id){
        return branchService.getBranchById(id);
    }

    @PutMapping("/{id}")
    public BranchResponseDTO updateBranch(
            @PathVariable Long id,
            @RequestBody BranchRequestDTO request
    ){
        return branchService.updateBranch(id,request);
    }

    @DeleteMapping("/{id}")
    public void deleteBranch(@PathVariable Long id){
        branchService.deleteBranch(id);
    }
}
