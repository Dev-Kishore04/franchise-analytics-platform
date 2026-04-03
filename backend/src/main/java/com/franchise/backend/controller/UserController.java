package com.franchise.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.franchise.backend.dto.*;
import com.franchise.backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public UserResponseDTO createUser(@RequestBody UserRequestDTO request) {
        return userService.createUser(request);
    }

    @GetMapping
    public List<UserResponseDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/branch/{branchId}")
    public List<UserResponseDTO> getUsersByBranch(@PathVariable Long branchId) {
        return userService.getUsersByBranch(branchId);
    }

    @PutMapping("/{id}")
    public UserResponseDTO updateUser(@PathVariable Long id, @RequestBody UserRequestDTO request) {
        return userService.updateUser(id, request);
    }

    @GetMapping("/un-managers")
    public ResponseEntity<List<UserResponseDTO>> getUnassignedManagers(){

        return ResponseEntity.ok(userService.getUnassignedManagers());

    }
    @GetMapping("/sorted-users")
    public ResponseEntity<List<UserResponseDTO>> getUsers(@RequestParam String name){

        return ResponseEntity.ok(userService.getUsers(name));

    }

    @PutMapping("/{id}/suspend")
    public void suspendUser(@PathVariable Long id) {
        userService.suspendUser(id);
    }

    @PutMapping("/{id}/restore")
    public void restoreUser(@PathVariable Long id) {
        userService.restoreUser(id);
    }

    @DeleteMapping("/{id}")
    public void deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
    }
}
