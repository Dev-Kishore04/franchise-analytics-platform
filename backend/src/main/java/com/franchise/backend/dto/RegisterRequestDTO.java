package com.franchise.backend.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RegisterRequestDTO {

    private String name;
    private String email;
    private String password;
    private Long roleId;
    private Long branchId;

}
