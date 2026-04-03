package com.franchise.backend.dto;
import lombok.*;
@Getter @AllArgsConstructor
public class UserResponseDTO {
    private Long id;
    private String name;
    private String email;
    private String role;
    private Long branchId;
    private String branchName;
    private String status;
    private String phone;
    private String jobTitle;
}
