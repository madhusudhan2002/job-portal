package com.jobportal.repository;

import com.jobportal.model.Job;
import com.jobportal.model.SavedJob;
import com.jobportal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SavedJobRepository extends JpaRepository<SavedJob, Long> {
    List<SavedJob> findByCandidate(User candidate);
    Optional<SavedJob> findByJobAndCandidate(Job job, User candidate);
    void deleteByJobAndCandidate(Job job, User candidate);
    boolean existsByJobAndCandidate(Job job, User candidate);
}
