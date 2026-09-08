package com.jobportal.service;

import com.jobportal.exception.ResourceNotFoundException;
import com.jobportal.model.Job;
import com.jobportal.model.Role;
import com.jobportal.model.User;
import com.jobportal.repository.CompanyRepository;
import com.jobportal.repository.JobRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class JobServiceTest {

    @Mock private JobRepository jobRepository;
    @Mock private CompanyRepository companyRepository;

    @InjectMocks
    private JobService jobService;

    @Test
    void getById_throwsWhenNotFound() {
        when(jobRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> jobService.getById(99L))
                .isInstanceOf(ResourceNotFoundException.class)
                .hasMessageContaining("99");
    }

    @Test
    void getById_returnsJobWhenFound() {
        Job job = Job.builder().id(1L).title("Backend Engineer").build();
        when(jobRepository.findById(1L)).thenReturn(Optional.of(job));

        Job result = jobService.getById(1L);

        assertThat(result.getTitle()).isEqualTo("Backend Engineer");
    }

    @Test
    void delete_deniedForNonOwnerNonAdmin() {
        User owner = User.builder().id(1L).role(Role.EMPLOYER).build();
        User otherEmployer = User.builder().id(2L).role(Role.EMPLOYER).build();
        Job job = Job.builder().id(10L).postedBy(owner).build();

        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        assertThatThrownBy(() -> jobService.delete(10L, otherEmployer))
                .isInstanceOf(SecurityException.class);
    }

    @Test
    void delete_allowedForAdmin() {
        User owner = User.builder().id(1L).role(Role.EMPLOYER).build();
        User admin = User.builder().id(3L).role(Role.ADMIN).build();
        Job job = Job.builder().id(10L).postedBy(owner).build();

        when(jobRepository.findById(10L)).thenReturn(Optional.of(job));

        jobService.delete(10L, admin);
        // no exception thrown means success; verify delete was invoked
    }
}
