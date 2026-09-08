package com.jobportal.controller;

import com.jobportal.model.SavedJob;
import com.jobportal.model.User;
import com.jobportal.service.SavedJobService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@RequiredArgsConstructor
@CrossOrigin(origins="*")

public class SavedJobController {

    private final SavedJobService savedJobService;

    @PostMapping("/{jobId}")
    public ResponseEntity<SavedJob> save(@PathVariable Long jobId, @AuthenticationPrincipal User candidate) {
        return ResponseEntity.ok(savedJobService.save(jobId, candidate));
    }

    @DeleteMapping("/{jobId}")
    public ResponseEntity<Void> unsave(@PathVariable Long jobId, @AuthenticationPrincipal User candidate) {
        savedJobService.unsave(jobId, candidate);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<SavedJob>> list(@AuthenticationPrincipal User candidate) {
        return ResponseEntity.ok(savedJobService.list(candidate));
    }
}
