package com.jobportal.controller;

import com.jobportal.dto.JobRequest;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.service.JobService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@RequiredArgsConstructor
@CrossOrigin(origins="*")

public class JobController {

    private final JobService jobService;

    @GetMapping
    public ResponseEntity<Page<Job>> list(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) Job.WorkMode workMode,
            @RequestParam(required = false) Job.EmploymentType employmentType,
            @RequestParam(required = false) String skill,
            @RequestParam(required = false) Job.Status status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction) {

        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);

        return ResponseEntity.ok(jobService.search(keyword, location, workMode, employmentType, skill, status, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Job> getById(@PathVariable Long id) {
        return ResponseEntity.ok(jobService.getById(id));
    }

    @PostMapping
    public ResponseEntity<Job> create(@Valid @RequestBody JobRequest request, @AuthenticationPrincipal User employer) {
        return ResponseEntity.ok(jobService.create(request, employer));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Job> update(@PathVariable Long id, @RequestBody JobRequest request,
                                       @AuthenticationPrincipal User employer) {
        return ResponseEntity.ok(jobService.update(id, request, employer));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, @AuthenticationPrincipal User employer) {
        jobService.delete(id, employer);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}/close")
    public ResponseEntity<Job> close(@PathVariable Long id, @AuthenticationPrincipal User employer) {
        return ResponseEntity.ok(jobService.close(id, employer));
    }
}
