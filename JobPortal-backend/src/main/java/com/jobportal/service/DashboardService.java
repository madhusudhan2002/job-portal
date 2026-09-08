package com.jobportal.service;

import com.jobportal.dto.DashboardStatsResponse;
import com.jobportal.model.Job;
import com.jobportal.repository.ApplicationRepository;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import com.jobportal.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final UserRepository userRepository;
    private final JobRepository jobRepository;
    private final CompanyRepository companyRepository;
    private final ApplicationRepository applicationRepository;

    public DashboardStatsResponse getStats() {
        List<Job> allJobs = jobRepository.findAll();

        Map<String, Long> skillCounts = allJobs.stream()
                .flatMap(j -> j.getSkills() == null ? List.<String>of().stream() : j.getSkills().stream())
                .collect(Collectors.groupingBy(s -> s, Collectors.counting()));

        Map<String, Long> companyCounts = allJobs.stream()
                .filter(j -> j.getCompany() != null)
                .collect(Collectors.groupingBy(j -> j.getCompany().getName(), Collectors.counting()));

        Map<String, Long> locationCounts = allJobs.stream()
                .filter(j -> j.getLocation() != null)
                .collect(Collectors.groupingBy(Job::getLocation, Collectors.counting()));

        return DashboardStatsResponse.builder()
                .totalUsers(userRepository.count())
                .totalJobs(jobRepository.count())
                .totalCompanies(companyRepository.count())
                .totalApplications(applicationRepository.count())
                .jobsScrapedToday(jobRepository.countByPostedDate(LocalDate.now()))
                .topSkills(topN(skillCounts, 10))
                .topCompanies(topN(companyCounts, 10))
                .topLocations(topN(locationCounts, 10))
                .build();
    }

    private List<Map.Entry<String, Long>> topN(Map<String, Long> counts, int n) {
        return counts.entrySet().stream()
                .sorted(Map.Entry.<String, Long>comparingByValue().reversed())
                .limit(n)
                .collect(Collectors.toList());
    }
}
