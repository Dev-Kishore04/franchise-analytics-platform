package com.franchise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class BranchOrderCountDTO {

    private Long branchId;
    private String branchName;
    private long orderCount;

}
