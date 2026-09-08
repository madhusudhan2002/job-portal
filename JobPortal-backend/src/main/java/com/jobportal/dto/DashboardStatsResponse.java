package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;
import java.util.Map;

@Data
@Builder
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalUsers;
    private long totalJobs;
    private long totalCompanies;
    private long totalApplications;
    private long jobsScrapedToday;
    private List<Map.Entry<String, Long>> topSkills;
    private List<Map.Entry<String, Long>> topCompanies;
    private List<Map.Entry<String, Long>> topLocations;
}
