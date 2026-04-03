package com.franchise.backend.entity;

import java.time.LocalDate;
import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ai_insights")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class AIInsight {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate generatedDate;

    @Column(length = 2000)
    private String insightText;

    @Column(length = 2000)
    private String recommendationText;

    private String impactLevel;      // "High", "Medium", "Low"

    private String status;           // "New", "Accepted", "Dismissed"

    private String category;         // "Efficiency", "Staffing", "Inventory", "Sales"

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.generatedDate = LocalDate.now();
        if (this.status == null) this.status = "New";
        if (this.impactLevel == null) this.impactLevel = "Medium";
        if (this.category == null) this.category = "General";
    }
}
