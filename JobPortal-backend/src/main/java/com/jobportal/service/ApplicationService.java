package com.jobportal.service;

import com.jobportal.dto.ApplicationRequest;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final JobRepository jobRepository;

    public Application apply(Long jobId, ApplicationRequest request, User candidate) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));

        if (job.getStatus() != Job.Status.OPEN) {
            throw new IllegalStateException("This job is no longer accepting applications");
        }
        if (applicationRepository.existsByJobAndCandidate(job, candidate)) {
            throw new IllegalStateException("You have already applied to this job");
        }

        Application application = Application.builder()
                .job(job)
                .candidate(candidate)
                .resumeUrl(request.getResumeUrl())
                .coverLetter(request.getCoverLetter())
                .build();

        return applicationRepository.save(application);
    }

    public Page<Application> getForCandidate(User candidate, Pageable pageable) {
        return applicationRepository.findByCandidate(candidate, pageable);
    }

    public Page<Application> getForEmployer(User employer, Pageable pageable) {
        return applicationRepository.findByJobPostedBy(employer, pageable);
    }
}
