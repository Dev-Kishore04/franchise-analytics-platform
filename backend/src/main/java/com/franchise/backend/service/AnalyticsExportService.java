package com.franchise.backend.service;

import java.io.ByteArrayOutputStream;
import java.util.List;

import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;

import com.franchise.backend.dto.BranchRankingDTO;
import com.franchise.backend.dto.DashboardResponseDTO;
import com.franchise.backend.dto.TopProductDTO;

@Service
public class AnalyticsExportService {

    public byte[] generateExcel(
            DashboardResponseDTO dashboard,
            List<BranchRankingDTO> ranking,
            List<TopProductDTO> products
    ) throws Exception {

        XSSFWorkbook workbook = new XSSFWorkbook();

        /* ---------------- KPI Sheet ---------------- */

        Sheet kpiSheet = workbook.createSheet("KPI Summary");

        Row header = kpiSheet.createRow(0);
        header.createCell(0).setCellValue("Metric");
        header.createCell(1).setCellValue("Value");

        Row r1 = kpiSheet.createRow(1);
        r1.createCell(0).setCellValue("Total Revenue");
        r1.createCell(1).setCellValue(dashboard.getTotalRevenue());

        Row r2 = kpiSheet.createRow(2);
        r2.createCell(0).setCellValue("Total Orders");
        r2.createCell(1).setCellValue(dashboard.getTotalOrders());

        Row r3 = kpiSheet.createRow(3);
        r3.createCell(0).setCellValue("Average Order Value");
        r3.createCell(1).setCellValue(dashboard.getAverageOrderValue());

        Row r4 = kpiSheet.createRow(4);
        r4.createCell(0).setCellValue("Branches");
        r4.createCell(1).setCellValue(dashboard.getTotalBranches());


        /* ---------------- Branch Ranking Sheet ---------------- */

        Sheet rankingSheet = workbook.createSheet("Branch Ranking");

        Row h2 = rankingSheet.createRow(0);
        h2.createCell(0).setCellValue("Branch");
        h2.createCell(1).setCellValue("Revenue");

        int rowIndex = 1;

        for (BranchRankingDTO b : ranking) {
            Row row = rankingSheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(b.getBranchName());
            row.createCell(1).setCellValue(b.getRevenue());
        }


        /* ---------------- Top Products Sheet ---------------- */

        Sheet productSheet = workbook.createSheet("Top Products");

        Row h3 = productSheet.createRow(0);
        h3.createCell(0).setCellValue("Product");
        h3.createCell(1).setCellValue("Units Sold");
        h3.createCell(2).setCellValue("Revenue");

        rowIndex = 1;

        for (TopProductDTO p : products) {
            Row row = productSheet.createRow(rowIndex++);
            row.createCell(0).setCellValue(p.getProductName());
            row.createCell(1).setCellValue(p.getUnitsSold());
            row.createCell(2).setCellValue(p.getRevenue());
        }


        /* ---------------- Return File ---------------- */

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        workbook.write(out);
        workbook.close();

        return out.toByteArray();
    }
}