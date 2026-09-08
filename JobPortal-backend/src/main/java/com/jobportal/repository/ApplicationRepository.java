package com.jobportal.repository;

import com.jobportal.model.Application;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ApplicationRepository extends JpaRepository<Application, Long> {
    Page<Application> findByCandidate(User candidate, Pageable pageable);
    Page<Application> findByJobPostedBy(User employer, Pageable pageable);
    List<Application> findByJob(Job job);
    Optional<Application> findByJobAndCandidate(Job job, User candidate);
    boolean existsByJobAndCandidate(Job job, User candidate);
}
