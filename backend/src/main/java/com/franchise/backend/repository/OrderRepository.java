package com.franchise.backend.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.franchise.backend.dto.BranchOrderCountDTO;
import com.franchise.backend.dto.BranchOrderValueDTO;
import com.franchise.backend.dto.BranchRankingDTO;
import com.franchise.backend.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o")
    Double getTotalRevenue();

    @Query("SELECT COUNT(o) FROM Order o")
    Long getTotalOrders();

    @Query("SELECT COALESCE(AVG(o.totalAmount), 0) FROM Order o")
    Double getAverageOrderValue();

    @Query("""
    SELECT new com.franchise.backend.dto.BranchRankingDTO(
        b.id, b.name, COALESCE(SUM(o.totalAmount),0)
    )
    FROM Order o
    JOIN o.branch b
    GROUP BY b.id, b.name
    ORDER BY SUM(o.totalAmount) DESC
    """)
    List<BranchRankingDTO> getBranchRanking();

    List<Order> findByBranchIdOrderByCreatedAtDesc(Long branchId);

    List<Order> findTop10ByBranchIdOrderByCreatedAtDesc(Long branchId);

    @Query("""
    SELECT o.branch.id, DATE(o.createdAt), COALESCE(SUM(o.totalAmount),0)
    FROM Order o
    WHERE o.createdAt >= :startDate
    GROUP BY o.branch.id, DATE(o.createdAt)
    ORDER BY DATE(o.createdAt)
    """)
    List<Object[]> getLast30DaysRevenue(@Param("startDate") LocalDateTime startDate);

    @Query("""
    SELECT o.branch.id, COALESCE(SUM(o.totalAmount),0)
    FROM Order o
    WHERE o.createdAt >= :startDate
    GROUP BY o.branch.id
    ORDER BY SUM(o.totalAmount) DESC
    """)
    List<Object[]> getTotalRevenueLast30Days(@Param("startDate") LocalDateTime startDate);

    @Query("""
    SELECT o.branch.id, o.branch.name, DATE(o.createdAt), COALESCE(SUM(o.totalAmount),0)
    FROM Order o
    WHERE o.branch.id IN :branchIds
    AND o.createdAt >= :startDate
    GROUP BY o.branch.id, o.branch.name, DATE(o.createdAt)
    ORDER BY o.branch.id, DATE(o.createdAt)
    """)
    List<Object[]> getBranchRevenueLast7Days(
            @Param("branchIds") List<Long> branchIds,
            @Param("startDate") LocalDateTime startDate
    );

    @Query("""
    SELECT COALESCE(SUM(o.totalAmount),0)
    FROM Order o
    WHERE o.createdAt >= :startDate
    """)
    Double getTotalRevenueSince(@Param("startDate") LocalDateTime startDate);

    @Query("""
    SELECT COUNT(o)
    FROM Order o
    WHERE o.createdAt >= :startDate
    """)
    Long getTotalOrdersSince(@Param("startDate") LocalDateTime startDate);

    @Query("""
    SELECT COALESCE(AVG(o.totalAmount),0)
    FROM Order o
    WHERE o.createdAt >= :startDate
    """)
    Double getAverageOrderValueSince(@Param("startDate") LocalDateTime startDate);

    // for Ai insigths -------

    @Query("""
    SELECT new com.franchise.backend.dto.BranchOrderValueDTO(
        b.id,
        b.name,
        COALESCE(AVG(o.totalAmount),0)
    )
    FROM Order o
    JOIN o.branch b
    GROUP BY b.id, b.name
    ORDER BY AVG(o.totalAmount) DESC
    """)
    List<BranchOrderValueDTO> getAverageOrderValuePerBranch();

    @Query("""
    SELECT 
        YEAR(o.createdAt),
        MONTH(o.createdAt),
        COALESCE(SUM(o.totalAmount),0)
    FROM Order o
    WHERE o.createdAt >= :startDate
    GROUP BY YEAR(o.createdAt), MONTH(o.createdAt)
    ORDER BY YEAR(o.createdAt), MONTH(o.createdAt)
    """)
    List<Object[]> getRevenueLastMonths(@Param("startDate") LocalDateTime startDate);

    @Query("""
    SELECT 
        b.id,
        b.name,
        COALESCE(SUM(CASE WHEN o.createdAt >= :currentStart THEN o.totalAmount END),0),
        COALESCE(SUM(CASE WHEN o.createdAt < :currentStart AND o.createdAt >= :previousStart THEN o.totalAmount END),0)
    FROM Order o
    JOIN o.branch b
    GROUP BY b.id, b.name
    ORDER BY SUM(o.totalAmount) DESC
    """)
    List<Object[]> getBranchRevenueGrowth(
            @Param("currentStart") LocalDateTime currentStart,
            @Param("previousStart") LocalDateTime previousStart
    );

    @Query("""
    SELECT new com.franchise.backend.dto.BranchOrderCountDTO(
        b.id,
        b.name,
        COUNT(o.id)
    )
    FROM Order o
    JOIN o.branch b
    GROUP BY b.id, b.name
    ORDER BY COUNT(o.id) DESC
    """)
    List<BranchOrderCountDTO> getOrdersPerBranch();

    @Query("""
    SELECT new com.franchise.backend.dto.BranchRankingDTO(
        b.id,
        b.name,
        COALESCE(SUM(o.totalAmount),0)
    )
    FROM Order o
    JOIN o.branch b
    WHERE o.createdAt >= :startDate
    GROUP BY b.id, b.name
    ORDER BY SUM(o.totalAmount) DESC
    """)
    List<BranchRankingDTO> getBranchRankingSince(
            @Param("startDate") LocalDateTime startDate
    );

    @Query("""
    SELECT b.id, b.name, COUNT(o.id)
    FROM Order o
    JOIN o.branch b
    WHERE o.createdAt >= :startDate
    GROUP BY b.id, b.name
    ORDER BY COUNT(o.id) DESC
    """)
    List<Object[]> getOrdersPerBranchSince(
            @Param("startDate") LocalDateTime startDate
    );

    @Query("""
    SELECT b.id, b.name, COALESCE(SUM(o.totalAmount),0)
    FROM Order o
    JOIN o.branch b
    WHERE o.createdAt >= :startDate
    GROUP BY b.id, b.name
    ORDER BY SUM(o.totalAmount) DESC
    """)
    List<Object[]> getRevenuePerBranchSince(
            @Param("startDate") LocalDateTime startDate
    );

    @Query("""
    SELECT b.id, HOUR(o.createdAt), COUNT(o.id)
    FROM Order o
    JOIN o.branch b
    GROUP BY b.id, HOUR(o.createdAt)
    ORDER BY b.id
    """)
    List<Object[]> getOrdersByHourPerBranch();
}