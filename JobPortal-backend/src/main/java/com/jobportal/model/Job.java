package com.jobportal.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "jobs", indexes = {
        @Index(name = "idx_job_title", columnList = "title"),
        @Index(name = "idx_job_location", columnList = "location"),
        @Index(name = "idx_job_status", columnList = "status")
})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Job {

    public enum WorkMode { REMOTE, ONSITE, HYBRID }
    public enum EmploymentType { FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP }
    public enum Status { OPEN, CLOSED, DRAFT }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @ManyToOne
    @JoinColumn(name = "company_id")
    private Company company;

    private String location;

    @Enumerated(EnumType.STRING)
    private WorkMode workMode;

    @Enumerated(EnumType.STRING)
    private EmploymentType employmentType;

    private String salaryMin;
    private String salaryMax;
    private String currency;

    private String experience;

    @ElementCollection
    @CollectionTable(name = "job_skills", joinColumns = @JoinColumn(name = "job_id"))
    @Column(name = "skill")
    @Builder.Default
    private List<String> skills = new ArrayList<>();

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String benefits;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Builder.Default
    private Status status = Status.OPEN;

    @ManyToOne
    @JoinColumn(name = "posted_by")
    private User postedBy;

    // scraping metadata
    private String source;          // e.g. "manual", "remoteok"
    @Column(columnDefinition = "TEXT")
    private String sourceUrl;
    private LocalDate postedDate;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.postedDate == null) this.postedDate = LocalDate.now();
        if (this.source == null) this.source = "manual";
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
