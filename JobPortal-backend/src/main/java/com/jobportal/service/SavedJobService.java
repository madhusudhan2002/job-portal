package com.jobportal.service;

import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Job;
import com.jobportal.model.SavedJob;
import com.jobportal.model.User;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.SavedJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final JobRepository jobRepository;

    public SavedJob save(Long jobId, User candidate) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
        if (savedJobRepository.existsByJobAndCandidate(job, candidate)) {
            return savedJobRepository.findByJobAndCandidate(job, candidate).get();
        }
        return savedJobRepository.save(SavedJob.builder().job(job).candidate(candidate).build());
    }

    public void unsave(Long jobId, User candidate) {
        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + jobId));
        savedJobRepository.deleteByJobAndCandidate(job, candidate);
    }

    public List<SavedJob> list(User candidate) {
        return savedJobRepository.findByCandidate(candidate);
    }
}
