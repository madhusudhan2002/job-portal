package com.jobportal.service;

import com.jobportal.dto.JobRequest;
import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Company;
import com.jobportal.model.Job;
import com.jobportal.model.User;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import jakarta.persistence.criteria.Predicate;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;

    public Page<Job> search(String keyword, String location, Job.WorkMode workMode,
                             Job.EmploymentType employmentType, String skill,
                             Job.Status status, Pageable pageable) {

        Specification<Job> spec = (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (keyword != null && !keyword.isBlank()) {
                String like = "%" + keyword.toLowerCase() + "%";
                predicates.add(cb.or(
                        cb.like(cb.lower(root.get("title")), like),
                        cb.like(cb.lower(root.get("description")), like)
                ));
            }
            if (location != null && !location.isBlank()) {
                predicates.add(cb.like(cb.lower(root.get("location")), "%" + location.toLowerCase() + "%"));
            }
            if (workMode != null) {
                predicates.add(cb.equal(root.get("workMode"), workMode));
            }
            if (employmentType != null) {
                predicates.add(cb.equal(root.get("employmentType"), employmentType));
            }
            if (skill != null && !skill.isBlank()) {
                predicates.add(cb.isMember(skill, root.get("skills")));
            }
            if (status != null) {
                predicates.add(cb.equal(root.get("status"), status));
            } else {
                predicates.add(cb.equal(root.get("status"), Job.Status.OPEN));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        };

        return jobRepository.findAll(spec, pageable);
    }

    public Job getById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job not found: " + id));
    }

    public Job create(JobRequest request, User employer) {
        Company company = employer.getCompany();
        if (company == null && request.getCompanyName() != null) {
            company = companyRepository.findByNameIgnoreCase(request.getCompanyName())
                    .orElseGet(() -> companyRepository.save(Company.builder().name(request.getCompanyName()).build()));
        }

        Job job = Job.builder()
                .title(request.getTitle())
                .company(company)
                .location(request.getLocation())
                .workMode(request.getWorkMode())
                .employmentType(request.getEmploymentType())
                .salaryMin(request.getSalaryMin())
                .salaryMax(request.getSalaryMax())
                .currency(request.getCurrency())
                .experience(request.getExperience())
                .skills(request.getSkills())
                .description(request.getDescription())
                .benefits(request.getBenefits())
                .deadline(request.getDeadline())
                .status(request.getStatus() != null ? request.getStatus() : Job.Status.OPEN)
                .postedBy(employer)
                .source("manual")
                .build();

        return jobRepository.save(job);
    }

    public Job update(Long id, JobRequest request, User employer) {
        Job job = getById(id);
        assertOwnership(job, employer);

        if (request.getTitle() != null) job.setTitle(request.getTitle());
        if (request.getLocation() != null) job.setLocation(request.getLocation());
        if (request.getWorkMode() != null) job.setWorkMode(request.getWorkMode());
        if (request.getEmploymentType() != null) job.setEmploymentType(request.getEmploymentType());
        if (request.getSalaryMin() != null) job.setSalaryMin(request.getSalaryMin());
        if (request.getSalaryMax() != null) job.setSalaryMax(request.getSalaryMax());
        if (request.getCurrency() != null) job.setCurrency(request.getCurrency());
        if (request.getExperience() != null) job.setExperience(request.getExperience());
        if (request.getSkills() != null) job.setSkills(request.getSkills());
        if (request.getDescription() != null) job.setDescription(request.getDescription());
        if (request.getBenefits() != null) job.setBenefits(request.getBenefits());
        if (request.getDeadline() != null) job.setDeadline(request.getDeadline());
        if (request.getStatus() != null) job.setStatus(request.getStatus());

        return jobRepository.save(job);
    }

    public void delete(Long id, User employer) {
        Job job = getById(id);
        assertOwnership(job, employer);
        jobRepository.delete(job);
    }

    public Job close(Long id, User employer) {
        Job job = getById(id);
        assertOwnership(job, employer);
        job.setStatus(Job.Status.CLOSED);
        return jobRepository.save(job);
    }

    private void assertOwnership(Job job, User employer) {
        boolean isAdmin = employer.getRole().name().equals("ADMIN");
        boolean isOwner = job.getPostedBy() != null && job.getPostedBy().getId().equals(employer.getId());
        if (!isAdmin && !isOwner) {
            throw new SecurityException("You do not have permission to modify this job");
        }
    }
}
