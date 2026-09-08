package com.jobportal.controller;

import com.jobportal.dto.ScrapeResultResponse;
import com.jobportal.service.ScraperService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/scrape")
@RequiredArgsConstructor
@CrossOrigin(origins="*")

public class ScraperController {

    private final ScraperService scraperService;

    @PostMapping("/jobs")
    public ResponseEntity<ScrapeResultResponse> scrapeJobs(@RequestParam(defaultValue = "50") int limit) {
        return ResponseEntity.ok(scraperService.scrapeRemoteOk(limit));
    }
}
