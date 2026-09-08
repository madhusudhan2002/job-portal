package com.jobportal.repository;

import com.jobportal.model.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import java.time.LocalDate;
import java.util.Optional;

public interface JobRepository extends JpaRepository<Job, Long>, JpaSpecificationExecutor<Job> {
    Page<Job> findAll(Pageable pageable);
    long countByPostedDate(LocalDate date);
    Optional<Job> findBySourceUrlAndSource(String sourceUrl, String source);
    long countByStatus(Job.Status status);
}
