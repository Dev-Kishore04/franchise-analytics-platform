package com.franchise.backend.dto;
import lombok.*;
@Getter @AllArgsConstructor
public class BranchResponseDTO {
    private Long id;
    private String name;
    private String location;
    private String branchCode;
    private String status;
    private String managerName;
}
