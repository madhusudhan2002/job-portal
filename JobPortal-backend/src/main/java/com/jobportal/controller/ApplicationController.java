package com.jobportal.controller;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.model.Application;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.service.ApplicationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins="*")

public class ApplicationController {

    private final ApplicationService applicationService;

    @PostMapping("/api/jobs/{id}/apply")
    public ResponseEntity<Application> apply(@PathVariable Long id, @RequestBody(required = false) ApplicationRequest request,
                                              @AuthenticationPrincipal User candidate) {
        ApplicationRequest req = request != null ? request : new ApplicationRequest();
        return ResponseEntity.ok(applicationService.apply(id, req, candidate));
    }

    @GetMapping("/api/applications")
    public ResponseEntity<Page<Application>> myApplications(
            @AuthenticationPrincipal User user,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        Pageable pageable = PageRequest.of(page, size);
        if (user.getRole() == Role.EMPLOYER) {
            return ResponseEntity.ok(applicationService.getForEmployer(user, pageable));
        }
        return ResponseEntity.ok(applicationService.getForCandidate(user, pageable));
    }
}
