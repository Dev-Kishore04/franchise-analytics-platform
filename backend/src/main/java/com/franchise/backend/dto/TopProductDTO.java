package com.franchise.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class TopProductDTO {
    private String productName;
    private long unitsSold;
    private Double revenue;
   

}
