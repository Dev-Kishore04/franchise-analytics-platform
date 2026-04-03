package com.franchise.backend.service;

import java.sql.Date;
import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.franchise.backend.dto.BranchDailyRevenueDTO;
import com.franchise.backend.dto.BranchInsightResponseDTO;
import com.franchise.backend.dto.BranchOrderCountDTO;
import com.franchise.backend.dto.BranchOrderValueDTO;
import com.franchise.backend.dto.BranchProductDiversityDTO;
import com.franchise.backend.dto.BranchRankingDTO;
import com.franchise.backend.dto.BranchRevenueDTO;
import com.franchise.backend.dto.DashboardResponseDTO;
import com.franchise.backend.dto.TopProductDTO;
import com.franchise.backend.dto.TotaRevenue30DaysDTO;
import com.franchise.backend.repository.BranchRepository;
import com.franchise.backend.repository.OrderItemRepository;
import com.franchise.backend.repository.OrderRepository;

@Service
public class AnalyticsService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final BranchRepository branchRepository;

    public AnalyticsService(OrderRepository orderRepository,
            OrderItemRepository orderItemRepository,
            BranchRepository branchRepository) {
        this.orderRepository = orderRepository;
        this.orderItemRepository = orderItemRepository;
        this.branchRepository = branchRepository;
    }

    public DashboardResponseDTO getDashboard() {
    return getDashboard("M"); // default monthly
    }

    public DashboardResponseDTO getDashboard(String period) {

        LocalDateTime startDate = switch (period) {

            case "D" -> LocalDateTime.now().minusDays(1);

            case "W" -> LocalDateTime.now().minusWeeks(1);

            case "Y" -> LocalDateTime.now().minusYears(1);

            default -> LocalDateTime.now().minusMonths(1); // M
        };

        Double revenue = orderRepository.getTotalRevenueSince(startDate);
        Long orders = orderRepository.getTotalOrdersSince(startDate);
        Double avg = orderRepository.getAverageOrderValueSince(startDate);
        long branches = branchRepository.count();

        return new DashboardResponseDTO(
                revenue != null ? revenue : 0.0,
                orders != null ? orders : 0L,
                avg != null ? avg : 0.0,
                branches
        );
    }

    public List<BranchRevenueDTO> getLast30DaysRevenue(){
    LocalDateTime startDate = LocalDateTime.now().minusDays(30);
    List<Object[]> results = orderRepository.getLast30DaysRevenue(startDate);

        return results.stream()
                .map(r -> new BranchRevenueDTO(
                        (Long) r[0],
                        ((Date) r[1]).toLocalDate(),
                        (r[2]== null ? 0.0 :(Number) r[2]).doubleValue()
                ))
                .toList();
    }

    public List<TotaRevenue30DaysDTO> getRevenueLast30Days() {

        LocalDateTime startDate = LocalDateTime.now().minusDays(30);

        List<Object[]> results =
                orderRepository.getTotalRevenueLast30Days(startDate);

        return results.stream()
                .map(r -> new TotaRevenue30DaysDTO(
                        (Long) r[0],
                        ((Number) r[1]).doubleValue()
                ))
                .toList();
    }

    public List<BranchRankingDTO> getBranchRanking() {
        return orderRepository.getBranchRanking();
    }

    public List<TopProductDTO> getTopProducts() {
        return orderItemRepository.getTopProducts(PageRequest.of(0,5));
    }

    public List<BranchDailyRevenueDTO> getTopBranchesLast7DaysRevenue() {

        // get branch ranking
        List<BranchRankingDTO> ranking = orderRepository.getBranchRanking();

        // take top 2
        List<Long> topBranchIds = ranking.stream()
                .limit(2)
                .map(BranchRankingDTO::getBranchId)
                .toList();

        LocalDateTime startDate = LocalDateTime.now().minusDays(7);

        List<Object[]> results =
                orderRepository.getBranchRevenueLast7Days(topBranchIds, startDate);

        return results.stream()
                .map(r -> new BranchDailyRevenueDTO(
                        (Long) r[0],
                        (String) r[1],
                        ((Date) r[2]).toLocalDate(),
                        ((Number) r[3]).doubleValue()
                ))
                .toList();
    }

    public List<BranchOrderValueDTO> getBranchAverageOrderValue() {
        return orderRepository.getAverageOrderValuePerBranch();
    }

    public List<BranchOrderCountDTO> getOrdersPerBranch() {
        return orderRepository.getOrdersPerBranch();
    }
    

    public List<BranchProductDiversityDTO> getProductDiversity() {
        return orderItemRepository.getProductDiversityPerBranch();
    }

    public Map<String, Object> getAIAnalyticsData() {

        Map<String, Object> data = new HashMap<>();

        data.put("dashboard", getDashboard());

        data.put("branchRanking", getBranchRanking());

        data.put("underperformingBranches", getUnderperformingBranches());

        data.put("topBranches", getTopBranches());

        data.put("branchAvgOrderValue", getBranchAverageOrderValue());

        data.put("branchOrders", getOrdersPerBranch());

        data.put("topProducts", getTopProducts());

        data.put("productDiversity", getProductDiversity());

        data.put("revenueTrend", getLast30DaysRevenue());

        return data;
    }

    //to identify underperforming branch with logics ----

    public List<BranchRankingDTO> getUnderperformingBranches() {

        List<BranchRankingDTO> ranking = orderRepository.getBranchRanking();

        if (ranking.isEmpty()) {
            return List.of();
        }

        // Top branch revenue
        double topRevenue = ranking.get(0).getRevenue();

        // 60% threshold
        double threshold = topRevenue * 0.6;

        return ranking.stream()

                // ignore new branches
                .filter(b -> b.getRevenue() > 0)

                // below threshold
                .filter(b -> b.getRevenue() < threshold)

                // sort lowest first
                .sorted(Comparator.comparingDouble(BranchRankingDTO::getRevenue))

                // take bottom 3
                .limit(3)

                .toList();
    }

    // top 3 branch for benchmark

    public List<BranchRankingDTO> getTopBranches() {

        List<BranchRankingDTO> ranking = orderRepository.getBranchRanking();

        return ranking.stream()
                .limit(3)
                .toList();
    }

    public BranchInsightResponseDTO getBranchInsight(Long branchId) {

        List<BranchRankingDTO> ranking = getBranchRanking();
        List<BranchOrderValueDTO> avgValues = getBranchAverageOrderValue();
        List<BranchOrderCountDTO> orderCounts = getOrdersPerBranch();
        List<BranchProductDiversityDTO> diversity = getProductDiversity();
        List<BranchRankingDTO> topBranches = getTopBranches();

        BranchRankingDTO branch = ranking.stream()
                .filter(b -> b.getBranchId().equals(branchId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Branch not found"));

        BranchRankingDTO top = topBranches.isEmpty() ? ranking.get(0) : topBranches.get(0);

        BranchOrderValueDTO branchAov = avgValues.stream()
                .filter(a -> a.getBranchId().equals(branchId))
                .findFirst()
                .orElse(null);

        BranchOrderCountDTO branchOrders = orderCounts.stream()
                .filter(o -> o.getBranchId().equals(branchId))
                .findFirst()
                .orElse(null);

        BranchProductDiversityDTO branchDiversity = diversity.stream()
                .filter(d -> d.getBranchId().equals(branchId))
                .findFirst()
                .orElse(null);

        BranchOrderValueDTO topAov = avgValues.stream()
                .filter(a -> a.getBranchId().equals(top.getBranchId()))
                .findFirst()
                .orElse(null);

        BranchOrderCountDTO topOrders = orderCounts.stream()
                .filter(o -> o.getBranchId().equals(top.getBranchId()))
                .findFirst()
                .orElse(null);

        BranchProductDiversityDTO topDiversity = diversity.stream()
                .filter(d -> d.getBranchId().equals(top.getBranchId()))
                .findFirst()
                .orElse(null);

        int rank = ranking.indexOf(branch) + 1;

        double branchRevenue = branch.getRevenue();
        double topRevenue = top.getRevenue();

        long branchOrderValue = branchOrders != null ? branchOrders.getOrderCount() : 0L;
        double branchAvg = branchAov != null ? branchAov.getAvgOrderValue() : 0.0;
        long branchProducts = branchDiversity != null ? branchDiversity.getProductTypes() : 0L;

        long topOrderValue = topOrders != null ? topOrders.getOrderCount() : 0L;
        double topAvg = topAov != null ? topAov.getAvgOrderValue() : 0.0;
        long topProducts = topDiversity != null ? topDiversity.getProductTypes() : 0L;

        String insight;
        String recommendation;

        double revenueGapPct = topRevenue > 0 ? ((topRevenue - branchRevenue) / topRevenue) * 100 : 0;
        double orderGapPct = topOrderValue > 0 ? ((topOrderValue - branchOrderValue) * 100.0) / topOrderValue : 0;
        double aovGapPct = topAvg > 0 ? ((topAvg - branchAvg) * 100.0) / topAvg : 0;
        double diversityGapPct = topProducts > 0 ? ((topProducts - branchProducts) * 100.0) / topProducts : 0;

        if (orderGapPct >= revenueGapPct && orderGapPct >= aovGapPct && orderGapPct >= diversityGapPct) {
            insight = "The branch has significantly fewer orders compared to the network leader.";
            recommendation = "Increase customer traffic through offers, local promotions, and better conversion inside the store.";
        } else if (aovGapPct >= revenueGapPct && aovGapPct >= orderGapPct && aovGapPct >= diversityGapPct) {
            insight = "The branch is generating lower basket value than top-performing branches.";
            recommendation = "Use combo offers, upselling, and premium product bundling to increase average order value.";
        } else if (diversityGapPct >= revenueGapPct && diversityGapPct >= orderGapPct && diversityGapPct >= aovGapPct) {
            insight = "The branch has fewer product types than the strongest branch in the network.";
            recommendation = "Add the best-selling products from the top branch and expand category variety.";
        } else {
            insight = "The branch revenue is significantly below the top branch benchmark.";
            recommendation = "Improve sales mix, product availability, and order volume using proven top-branch strategies.";
        }

        return new BranchInsightResponseDTO(
                branch.getBranchId(),
                branch.getBranchName(),
                rank,
                branchRevenue,
                branchOrderValue,
                branchAvg,
                branchProducts,
                topRevenue,
                topOrderValue,
                topAvg,
                topProducts,
                insight,
                recommendation
        );
    }
}
