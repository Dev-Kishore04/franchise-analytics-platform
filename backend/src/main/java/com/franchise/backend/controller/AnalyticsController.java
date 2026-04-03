package com.franchise.backend.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.franchise.backend.dto.BranchDailyRevenueDTO;
import com.franchise.backend.dto.BranchInsightResponseDTO;
import com.franchise.backend.dto.BranchOrderValueDTO;
import com.franchise.backend.dto.BranchRankingDTO;
import com.franchise.backend.dto.BranchRevenueDTO;
import com.franchise.backend.dto.DashboardResponseDTO;
import com.franchise.backend.dto.TopProductDTO;
import com.franchise.backend.dto.TotaRevenue30DaysDTO;
import com.franchise.backend.repository.OrderRepository;
import com.franchise.backend.service.AnalyticsExportService;
import com.franchise.backend.service.AnalyticsService;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final AnalyticsExportService analyticsExportService;
    private final OrderRepository orderRepository;

    public AnalyticsController(AnalyticsService analyticsService, OrderRepository orderRepository, AnalyticsExportService analyticsExportService){
        this.analyticsService = analyticsService;
        this.analyticsExportService = analyticsExportService;
        this.orderRepository = orderRepository;
    }

    @GetMapping("/dashboard")
    public DashboardResponseDTO getDashboard(@RequestParam(defaultValue = "M") String period) {
        return analyticsService.getDashboard(period);
    }
    @GetMapping("/branch-ranking")
    public List<BranchRankingDTO> getBranchRanking(){
        return analyticsService.getBranchRanking();
    }

    @GetMapping("/top-products")
    public List<TopProductDTO> getTopProducts(){
        return analyticsService.getTopProducts();
    }

    @GetMapping("/revenue/last-30-days")
    public ResponseEntity<List<BranchRevenueDTO>> getLast30DaysRevenue(){

        return ResponseEntity.ok(
                analyticsService.getLast30DaysRevenue()
        );
    }

    @GetMapping("/weekly-branch-revenue")
    public List<BranchDailyRevenueDTO> getWeeklyBranchRevenue() {
        return analyticsService.getTopBranchesLast7DaysRevenue();
    }

    @GetMapping("/branch-aov")
    public List<BranchOrderValueDTO> getAverageOrderValuePerBranch() {
        return analyticsService.getBranchAverageOrderValue();
    }

    @GetMapping("/underperforming")
    public List<BranchRankingDTO> getUnderperformingBranches() {
        return analyticsService.getUnderperformingBranches();
    }
    @GetMapping("/total-revenue-30days")
    public List<TotaRevenue30DaysDTO> getTotalRevenueLast30Days() {
        return analyticsService.getRevenueLast30Days();
    }
    

    @GetMapping("/export")
    public ResponseEntity<byte[]> exportAnalytics(
                @RequestParam(defaultValue = "M") String period
        ) throws Exception {

            DashboardResponseDTO dashboard = analyticsService.getDashboard(period);
            List<BranchRankingDTO> ranking = analyticsService.getBranchRanking();
            List<TopProductDTO> products = analyticsService.getTopProducts();

            byte[] file = analyticsExportService.generateExcel(
                    dashboard,
                    ranking,
                    products
            );

            return ResponseEntity.ok()
                    .header("Content-Disposition", "attachment; filename=analytics-report.xlsx")
                    .header("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
                    .body(file);
        }

        @GetMapping("/revenue/monthly")
        public List<Map<String,Object>> getRevenueLast8Months(){

            LocalDateTime startDate = LocalDateTime.now().minusMonths(8);

            List<Object[]> results = orderRepository.getRevenueLastMonths(startDate);

            return results.stream().map(r -> Map.of(
                "year", r[0],
                "month", r[1],
                "revenue", r[2]
            )).toList();
    }

    @GetMapping("/branch-revenue-growth")
    public List<Map<String,Object>> getBranchRevenueGrowth(){

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime currentStart = now.minusDays(30);
        LocalDateTime previousStart = now.minusDays(60);

        List<Object[]> results = orderRepository.getBranchRevenueGrowth(currentStart, previousStart);

        return results.stream().map(r -> {

            double current = ((Number) r[2]).doubleValue();
            double previous = ((Number) r[3]).doubleValue();

            double growth;

            if(previous == 0 && current > 0){
                growth = 100;
            }else if(previous == 0){
                growth = 0;
            }else{
                growth = ((current - previous) / previous) * 100;
            }

            return Map.of(
                "branchId", r[0],
                "branchName", r[1],
                "revenue", current,
                "growth", growth
            );
        }).toList();
    }

    @GetMapping("/branch-insight/{branchId}")
    public BranchInsightResponseDTO getBranchInsight(@PathVariable Long branchId) {
        return analyticsService.getBranchInsight(branchId);
    }
}
