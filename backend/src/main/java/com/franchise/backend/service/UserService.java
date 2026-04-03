package com.franchise.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.franchise.backend.dto.UserRequestDTO;
import com.franchise.backend.dto.UserResponseDTO;
import com.franchise.backend.entity.Branch;
import com.franchise.backend.entity.Role;
import com.franchise.backend.entity.User;
import com.franchise.backend.repository.BranchRepository;
import com.franchise.backend.repository.RoleRepository;
import com.franchise.backend.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final BranchRepository branchRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository,
                       RoleRepository roleRepository,
                       BranchRepository branchRepository,
                       PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.branchRepository = branchRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private UserResponseDTO toDTO(User u) {
        return new UserResponseDTO(
                u.getId(),
                u.getName(),
                u.getEmail(),
                u.getRole().getName(),
                u.getBranch() != null ? u.getBranch().getId() : null,
                u.getBranch() != null ? u.getBranch().getName() : null,
                u.getStatus(),
                u.getPhone(),
                u.getJobTitle()
        );
    }

    @Transactional
    public UserResponseDTO createUser(UserRequestDTO request) {

        Role role = roleRepository.findById(request.getRoleId())
                .orElseThrow(() -> new RuntimeException("Role not found"));

        Branch branch = null;

        if (request.getBranchId() != null) {
            branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(role);
        user.setBranch(branch);
        user.setStatus(request.getStatus() != null ? request.getStatus() : "Active");
        user.setPhone(request.getPhone());
        user.setJobTitle(request.getJobTitle());

        User savedUser = userRepository.save(user);

        // ⭐ AUTO ASSIGN MANAGER TO BRANCH
        if (branch != null && role.getName().equalsIgnoreCase("MANAGER")) {

            if (branch.getManager() != null) {
                throw new RuntimeException("Branch already has a manager");
            }

            branch.setManager(savedUser);
            branchRepository.save(branch);
        }

        return toDTO(savedUser);
    }

    public List<UserResponseDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<UserResponseDTO> getUsersByBranch(Long branchId) {
        return userRepository.findByBranchId(branchId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public List<UserResponseDTO> getUnassignedManagers() {
        return userRepository.findByRole_NameAndBranchIsNull("MANAGER")
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<UserResponseDTO> getUsers(String name) {
        return userRepository.findByRole_Name(name)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO updateUser(Long id, UserRequestDTO request) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setName(request.getName());
        user.setEmail(request.getEmail());

        if (request.getPassword() != null && !request.getPassword().isBlank()) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
        }

        Role role = user.getRole();

        if (request.getRoleId() != null) {
            role = roleRepository.findById(request.getRoleId())
                    .orElseThrow(() -> new RuntimeException("Role not found"));
            user.setRole(role);
        }

        Branch branch = null;

        if (request.getBranchId() != null) {
            branch = branchRepository.findById(request.getBranchId())
                    .orElseThrow(() -> new RuntimeException("Branch not found"));

            user.setBranch(branch);
        }

        if (request.getStatus() != null) user.setStatus(request.getStatus());
        if (request.getPhone() != null) user.setPhone(request.getPhone());
        if (request.getJobTitle() != null) user.setJobTitle(request.getJobTitle());

        User savedUser = userRepository.save(user);

        // ⭐ UPDATE MANAGER WHEN USER IS MANAGER
        if (branch != null && role.getName().equalsIgnoreCase("MANAGER")) {

            if (branch.getManager() != null && !branch.getManager().getId().equals(savedUser.getId())) {
                throw new RuntimeException("Branch already has another manager");
            }

            branch.setManager(savedUser);
            branchRepository.save(branch);
        }

        return toDTO(savedUser);
    }

    public void suspendUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus("Inactive");
        userRepository.save(user);
    }

    public void restoreUser(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setStatus("Active");
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public long countActive() {
        return userRepository.countByStatus("Active");
    }

    public long countInactive() {
        return userRepository.countByStatus("Inactive");
    }
}