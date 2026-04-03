package com.franchise.backend.dto;
import lombok.*;
@Getter @Setter
public class UserRequestDTO {
    private String name;
    private String email;
    private String password;
    private Long roleId;
    private Long branchId;
    private String status;
    private String phone;
    private String jobTitle;
}
