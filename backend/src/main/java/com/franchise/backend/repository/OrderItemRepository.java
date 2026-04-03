package com.franchise.backend.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.franchise.backend.dto.BranchProductDiversityDTO;
import com.franchise.backend.dto.TopProductDTO;
import com.franchise.backend.entity.OrderItem;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("""
    SELECT new com.franchise.backend.dto.TopProductDTO(
        p.name,
        CAST(SUM(oi.quantity) as long),
        SUM(oi.subtotal)
    )
    FROM OrderItem oi
    JOIN oi.product p
    GROUP BY p.id, p.name
    ORDER BY SUM(oi.quantity) DESC
    """)
    List<TopProductDTO> getTopProducts(Pageable pageable);
    
    @Query("""
    SELECT 
        oi.order.branch.id,
        oi.order.branch.name,
        p.name,
        SUM(oi.quantity),
        SUM(oi.subtotal)
    FROM OrderItem oi
    JOIN oi.product p
    GROUP BY oi.order.branch.id, oi.order.branch.name, p.name
    ORDER BY oi.order.branch.id, SUM(oi.quantity) DESC
    """)
    List<Object[]> getProductPerformanceByBranch();

    @Query("""
    SELECT new com.franchise.backend.dto.TopProductDTO(
        p.name,
        CAST(SUM(oi.quantity) as long),
        SUM(oi.subtotal)
    )
    FROM OrderItem oi
    JOIN oi.product p
    WHERE oi.order.branch.id = :branchId
    GROUP BY p.id, p.name
    ORDER BY SUM(oi.quantity) DESC
    """)
    List<TopProductDTO> getTopProductsByBranch(Long branchId, Pageable pageable);

    @Query("""
    SELECT new com.franchise.backend.dto.BranchProductDiversityDTO(
        oi.order.branch.id,
        COUNT(DISTINCT oi.product.id)
    )
    FROM OrderItem oi
    GROUP BY oi.order.branch.id
    """)
    List<BranchProductDiversityDTO> getProductDiversityPerBranch();
}

