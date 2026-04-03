package com.franchise.backend.repository;

import com.franchise.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByBranchId(Long branchId);
    List<User> findByStatus(String status);
    List<User> findByRole_NameAndBranchIsNull(String name);
    List<User> findByRole_Name(String name);
    long countByStatus(String status);
}
