package com.franchise.backend.dto;
import lombok.*;
@Getter @Setter
public class BranchRequestDTO {
    private String name;
    private String location;
    private String status;
    private Long managerId;
}
