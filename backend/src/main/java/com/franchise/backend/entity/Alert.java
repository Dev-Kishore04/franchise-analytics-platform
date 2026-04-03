package com.franchise.backend.entity;

import java.time.LocalDateTime;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "alerts")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor
public class Alert {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String alertType;        // INVENTORY, SALES, ANOMALY, SECURITY

    private String title;            // short headline e.g. "Critical Stock Depletion"

    @Column(length = 1000)
    private String message;          // detailed body text

    private String severity;         // HIGH, MEDIUM, LOW

    private String status;           // UNRESOLVED, RESOLVED

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "branch_id")
    private Branch branch;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) this.status = "UNRESOLVED";
    }
}
