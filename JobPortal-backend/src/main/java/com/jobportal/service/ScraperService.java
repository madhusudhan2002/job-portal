package com.jobportal.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.jobportal.dto.ScrapeResultResponse;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.Instant;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Scrapes job listings from RemoteOK's public JSON API (https://remoteok.com/api),
 * which explicitly permits automated/API access for non-commercial use.
 * No authentication or scraping of HTML is performed - this consumes their published feed.
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ScraperService {

    private static final String REMOTEOK_API = "https://remoteok.com/api";
    private static final String SOURCE = "remoteok";

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    public ScrapeResultResponse scrapeRemoteOk(int limit) {
        int added = 0, skipped = 0, errors = 0;
        List<String> errorMessages = new ArrayList<>();

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "Mozilla/5.0 (compatible; JobPortalBot/1.0)");
            HttpEntity<Void> entity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    REMOTEOK_API, HttpMethod.GET, entity, String.class);

            JsonNode root = objectMapper.readTree(response.getBody());
            if (!root.isArray()) {
                throw new IllegalStateException("Unexpected response format from RemoteOK");
            }

            int count = 0;
            for (JsonNode node : root) {
                if (count >= limit) break;
                // first element is legal/metadata, skip entries without an id
                if (!node.has("id") || !node.has("position")) continue;
                count++;

                try {
                    String sourceUrl = node.path("url").asText(null);
                    if (sourceUrl == null) {
                        String slug = node.path("slug").asText("");
                        sourceUrl = "https://remoteok.com/remote-jobs/" + slug;
                    }

                    boolean exists = jobRepository.findBySourceUrlAndSource(sourceUrl, SOURCE).isPresent();
                    if (exists) {
                        skipped++;
                        continue;
                    }

                    String companyName = node.path("company").asText("Unknown Company");
                    Company company = companyRepository.findByNameIgnoreCase(companyName)
                            .orElseGet(() -> companyRepository.save(Company.builder().name(companyName).build()));

                    List<String> tags = new ArrayList<>();
                    if (node.has("tags")) {
                        node.get("tags").forEach(t -> tags.add(t.asText()));
                    }

                    LocalDate postedDate = LocalDate.now();
                    if (node.has("date")) {
                        try {
                            postedDate = Instant.parse(node.path("date").asText())
                                    .atZone(ZoneId.systemDefault()).toLocalDate();
                        } catch (Exception ignored) { }
                    }

                    Job job = Job.builder()
                            .title(node.path("position").asText("Untitled"))
                            .company(company)
                            .location(node.path("location").asText("Remote"))
                            .workMode(Job.WorkMode.REMOTE)
                            .employmentType(Job.EmploymentType.FULL_TIME)
                            .skills(tags)
                            .description(stripHtml(node.path("description").asText("")))
                            .status(Job.Status.OPEN)
                            .source(SOURCE)
                            .sourceUrl(sourceUrl)
                            .postedDate(postedDate)
                            .build();

                    jobRepository.save(job);
                    added++;

                } catch (Exception e) {
                    errors++;
                    errorMessages.add(e.getMessage());
                    log.warn("Failed to import a job from RemoteOK: {}", e.getMessage());
                }
            }
        } catch (Exception e) {
            errors++;
            errorMessages.add("Fetch failed: " + e.getMessage());
            log.error("RemoteOK scrape failed", e);
        }

        return ScrapeResultResponse.builder()
                .added(added)
                .duplicatesSkipped(skipped)
                .errors(errors)
                .errorMessages(errorMessages)
                .build();
    }

    private String stripHtml(String html) {
        if (html == null) return null;
        String text = html.replaceAll("<[^>]*>", " ").replaceAll("\\s+", " ").trim();
        return text.length() > 2000 ? text.substring(0, 2000) : text;
    }

    /** Bonus: runs automatically every 6 hours. */
    @Scheduled(fixedRate = 6 * 60 * 60 * 1000)
    public void scheduledScrape() {
        log.info("Running scheduled RemoteOK scrape...");
        ScrapeResultResponse result = scrapeRemoteOk(50);
        log.info("Scheduled scrape complete: added={}, skipped={}, errors={}",
                result.getAdded(), result.getDuplicatesSkipped(), result.getErrors());
    }
}
