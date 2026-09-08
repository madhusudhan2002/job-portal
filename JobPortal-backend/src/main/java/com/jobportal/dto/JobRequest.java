package com.jobportal.dto;

import com.jobportal.model.Job;
import lombok.Data;

import java.time.LocalDate;
import java.util.List;

@Data
public class JobRequest {
    private String title;
    private String companyName; // used for employer's own company override / display
    private String location;
    private Job.WorkMode workMode;
    private Job.EmploymentType employmentType;
    private String salaryMin;
    private String salaryMax;
    private String currency;
    private String experience;
    private List<String> skills;
    private String description;
    private String benefits;
    private LocalDate deadline;
    private Job.Status status;
}
