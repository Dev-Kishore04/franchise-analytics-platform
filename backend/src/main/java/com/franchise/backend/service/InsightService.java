package com.franchise.backend.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import com.franchise.backend.dto.AIInsightResponseDTO;
import com.franchise.backend.dto.BranchRankingDTO;
import com.franchise.backend.dto.InsightDTO;
import com.franchise.backend.dto.InsightResponseDTO;
import com.franchise.backend.entity.AIInsight;
import com.franchise.backend.entity.Branch;
import com.franchise.backend.repository.AIInsightRepository;
import com.franchise.backend.repository.BranchRepository;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
public class InsightService {

    @Value("${groq.api.key}")
    private String apiKey;

    private final AIInsightRepository insightRepository;
    private final AnalyticsService analyticsService;
    private final RestTemplate restTemplate;
    private final BranchRepository branchRepository;

    public InsightService(AIInsightRepository insightRepository, AnalyticsService analyticsService,  BranchRepository branchRepository) {
        this.insightRepository = insightRepository;
        this.analyticsService = analyticsService;
        this.branchRepository = branchRepository;
        this.restTemplate = new RestTemplate();
    }

    private InsightResponseDTO toDTO(AIInsight i) {
        return new InsightResponseDTO(
                i.getId(),
                i.getBranch() != null ? i.getBranch().getId() : null,
                i.getBranch() != null ? i.getBranch().getName() : null,
                i.getInsightText(),
                i.getRecommendationText(),
                i.getImpactLevel(),
                i.getStatus(),
                i.getCategory(),
                i.getCreatedAt()
        );
    }

    private String extractJson(String text) {

        int start = text.indexOf("{");
        int end = text.lastIndexOf("}");

        if (start != -1 && end != -1) {
            return text.substring(start, end + 1);
        }

        return text;
    }

    public List<InsightResponseDTO> getAllInsights() {
        return insightRepository.findAllByOrderByCreatedAtDesc().stream().map(this::toDTO).toList();
    }

    public List<InsightResponseDTO> getInsightsByBranch(Long branchId) {
        return insightRepository.findByBranchId(branchId).stream().map(this::toDTO).toList();
    }

    public InsightResponseDTO updateInsightStatus(Long id, String status) {
        AIInsight insight = insightRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Insight not found"));
        insight.setStatus(status);
        insightRepository.save(insight);
        return toDTO(insight);
    }

    public void generateInsights() {

        String groqUrl = "https://api.groq.com/openai/v1/chat/completions";

        try {

            ObjectMapper objectMapper = new ObjectMapper();

            Map<String, Object> analyticsData = analyticsService.getAIAnalyticsData();
            String analyticsJson = objectMapper.writeValueAsString(analyticsData);

            // Step 1: Find underperforming branches
            List<BranchRankingDTO> underperforming =
                    analyticsService.getUnderperformingBranches();

            // Step 2: Count existing insights
            long existingInsights = insightRepository.count();

            int remainingSlots = (int) (8 - existingInsights);

            if (remainingSlots <= 0) {
                System.out.println("Maximum insight limit reached (8)");
                return;
            }

            // Step 3: Filter branches that already have insights
            List<Long> branchesToAnalyze = underperforming.stream()
                    .map(BranchRankingDTO::getBranchId)
                    .filter(branchId -> !insightRepository.existsByBranchId(branchId))
                    .limit(remainingSlots)
                    .toList();

            if (branchesToAnalyze.isEmpty()) {
                System.out.println("No new branches to analyze");
                return;
            }

            String prompt = """
            You are an expert franchise performance analyst.

            ONLY analyze the following branch IDs:
            %s

            Rules:

            1. Generate EXACTLY one insight per branchId
            2. Do NOT generate multiple insights for the same branch
            3. give only one insight for every branch id
            4. Maximum insights equals the number of branches provided
            5. Use the most critical performance problem for each branch
            6. Use numeric metrics from analytics data
            7. use branch name in every insight
            8. Provide a clear actionable recommendation
           

            Return ONLY valid JSON.

            Format:

            {
            "insights":[
                {
                "branchId":0,
                "metric":"",
                "value":0,
                "description":"",
                "recommendation":"",
                "impactLevel":"High|Medium|Low",
                "category":"Sales|Inventory|Staffing|Efficiency"
                }
            ]
            }

            Analytics Data:
            %s
            """.formatted(branchesToAnalyze, remainingSlots, analyticsJson);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String, Object> message = new HashMap<>();
            message.put("role", "user");
            message.put("content", prompt);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "llama-3.1-8b-instant");
            body.put("messages", List.of(message));
            body.put("temperature", 0.2);
            body.put("max_tokens", 700);

            HttpEntity<Map<String, Object>> request =
                    new HttpEntity<>(body, headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(groqUrl, request, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());

            String aiContent =
                    root.get("choices").get(0).get("message").get("content").asString();

            System.out.println("RAW AI RESPONSE:");
            System.out.println(aiContent);

            String cleanJson = extractJson(aiContent);

            AIInsightResponseDTO aiResponse =
                    objectMapper.readValue(cleanJson, AIInsightResponseDTO.class);

            if (aiResponse == null || aiResponse.getInsights() == null) {
                throw new RuntimeException("AI returned empty insights");
            }

            List<InsightDTO> insights =
                    aiResponse.getInsights().stream().limit(remainingSlots).toList();

           

            for (InsightDTO dto : insights) {

                if (dto.getBranchId() == null) continue;

                if (!branchesToAnalyze.contains(dto.getBranchId())) continue;


                AIInsight insight = new AIInsight();

                insight.setInsightText(dto.getDescription());
                insight.setRecommendationText(dto.getRecommendation());

                insight.setImpactLevel(
                        dto.getImpactLevel() != null ? dto.getImpactLevel() : "Medium"
                );

                insight.setCategory(
                        dto.getCategory() != null ? dto.getCategory() : "General"
                );

                insight.setStatus("New");

                Branch branch = branchRepository
                        .findById(dto.getBranchId())
                        .orElse(null);

                insight.setBranch(branch);

                boolean exists =
                        insightRepository.existsByBranchIdAndCategoryAndInsightText(
                                dto.getBranchId(),
                                insight.getCategory(),
                                insight.getInsightText()
                        );

                if (!exists) {
                    insightRepository.save(insight);
                }
            }

        } catch (Exception e) {

            e.printStackTrace();

            throw new RuntimeException("AI insight generation failed", e);
        }
    }

    @Transactional
    public void deleteAllInsights() {
        insightRepository.deleteAllInsights();
    }

    public String generateRecommendation(String context, Map<String,Object> data) {

        String groqUrl = "https://api.groq.com/openai/v1/chat/completions";

        try {

            ObjectMapper mapper = new ObjectMapper();

            String dataJson = mapper.writeValueAsString(data);

            String prompt;

            switch (context) {

                case "branches":
                    prompt = """
                    You are an AI business optimization assistant for a franchise management system.

                    Analyze the provided data and give ONE short recommendation.

                    Rules:
                    - Maximum 25 words.
                    - Do NOT include headings like "Recommendation".
                    - Do NOT include explanations.
                    - Mention branch names if relevant.
                    - Mention metrics if relevent

                    Example output:
                    Assign a dedicated manager to unassigned branches to improve operational oversight and increase revenue performance.

                    Data:
                    %s
                    """.formatted(dataJson);
                    break;

                case "staff":
                    prompt = """
                    You are an AI business optimization assistant for a franchise management system.

                    Analyze the provided data and give ONE short recommendation.

                    Rules:
                    - Maximum 25 words.
                    - Do NOT include headings like "Recommendation".
                    - Do NOT include explanations.
                    - Mention branch names if relevant.
                    - Mention metrics if relevent

                    Example output:
                    Promote experienced staff members to shift leaders during peak hours to improve coordination and reduce customer wait times.
                    Reassign staff from low-traffic branches to high-demand locations during peak hours to balance workload and improve service speed.
                    Provide targeted training for new employees in underperforming branches to improve productivity and customer satisfaction.
                    Introduce performance-based incentives to encourage higher sales engagement and better customer interaction among frontline staff.
                    Data:
                    %s
                    """.formatted(dataJson);
                    break;

                case "products":
                    prompt = """
                    You are an AI business optimization assistant for a franchise management system.

                    Analyze the provided data and give ONE short recommendation.

                    Rules:
                    - Maximum 25 words.
                    - Do NOT include headings like "Recommendation".
                    - Do NOT include explanations.
                    - Mention branch names if relevant.
                    - Mention metrics if relevent

                    Example output:
                    Introduce bundle discounts for slow-moving beverage items to increase sales volume and reduce excess inventory.
                    Highlight best-selling products in promotional displays to encourage impulse purchases and increase overall order value.
                    Add seasonal variations to popular menu items to attract repeat customers and improve product diversity.
                    Promote complementary add-ons with high-margin items to increase average order value across branches.
                    Data:
                    %s
                    """.formatted(dataJson);
                    break;

                case "inventory":
                    prompt = """
                    You are an AI business optimization assistant for a franchise management system.

                    Analyze the provided data and give ONE short recommendation.

                    Rules:
                    - Maximum 25 words.
                    - Do NOT include headings like "Recommendation".
                    - Do NOT include explanations.
                    - Mention branch names if relevant.
                    - Mention metrics if relevent

                    Example output:
                    Transfer excess stock from low-demand branches to high-traffic locations to prevent shortages and reduce product waste.
                    Increase reorder frequency for fast-moving products to avoid stockouts during peak demand periods.
                    Reduce bulk purchasing for slow-selling items to improve inventory turnover and minimize storage costs.
                    Adjust inventory thresholds based on weekly demand patterns to maintain balanced stock levels across branches.
                    Data:
                    %s
                    """.formatted(dataJson);
                    break;

                case "analytics":
                    prompt = """
                    You are an AI business optimization assistant for a franchise management system.

                    Analyze the provided data and give ONE short recommendation.

                    Rules:
                    - Maximum 25 words.
                    - Do NOT include headings like "Recommendation".
                    - Do NOT include explanations.
                    - Mention branch names if relevant.
                    - Mention metrics if relevent

                    Example output:
                   Branch traffic has increased while average order value declined; introduce bundle promotions to recover margins and improve revenue stability.
                    Revenue growth is concentrated in a few branches; replicating their sales strategies could improve performance across weaker locations.
                    Order volume is increasing but staffing remains constant; adjusting shift schedules may improve service speed and customer satisfaction.
                    Product diversity strongly correlates with higher revenue; expanding menu options in low-diversity branches may boost sales.
                    Data:
                    %s
                    """.formatted(dataJson);
                    break;

                case "alerts":
                    prompt = """
                    You are an AI business optimization assistant for a franchise management system.

                    Analyze the provided data and give ONE short recommendation.

                    Rules:
                    - Maximum 25 words.
                    - Do NOT include headings like "Recommendation".
                    - Do NOT include explanations.
                    - Mention branch names if relevant.
                    - Mention metrics if relevent

                    Example output:
                    Resolve inventory alerts in batches to reduce operational delays and maintain consistent product availability across branches.
                    Address repeated stockout alerts by increasing reorder frequency for high-demand products during peak sales periods.
                    Review recurring inventory discrepancies to identify possible supply chain or stock management inefficiencies.
                    Data:
                    %s
                    """.formatted(dataJson);
                    break;

                default:
                    prompt = "Provide one business optimization recommendation.";
            }

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            headers.setBearerAuth(apiKey);

            Map<String,Object> message = new HashMap<>();
            message.put("role","user");
            message.put("content",prompt);

            Map<String,Object> body = new HashMap<>();
            body.put("model","llama-3.1-8b-instant");
            body.put("messages",List.of(message));
            body.put("temperature",0.3);

            HttpEntity<Map<String,Object>> request =
                    new HttpEntity<>(body,headers);

            ResponseEntity<String> response =
                    restTemplate.postForEntity(groqUrl,request,String.class);

            JsonNode root = mapper.readTree(response.getBody());

            return root.get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asString();

        } catch(Exception e) {

            e.printStackTrace();

            return "AI recommendation unavailable.";
        }
    }
}