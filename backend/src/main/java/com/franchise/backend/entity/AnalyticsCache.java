package com.franchise.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "analytics_cache")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AnalyticsCache {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate date;

    private String period;           // "DAILY", "WEEKLY", "MONTHLY", "YEARLY"

    private Integer totalOrders;

    private Double totalRevenue;

    private Double weeklyRevenue;    // new

    private Double avgOrderValue;

    private Long topProductId;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.date = LocalDate.now();
        if (this.period == null) this.period = "DAILY";
    }
}
