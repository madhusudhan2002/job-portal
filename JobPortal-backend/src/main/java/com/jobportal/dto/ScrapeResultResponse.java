package com.jobportal.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
public class ScrapeResultResponse {
    private int added;
    private int duplicatesSkipped;
    private int errors;
    private List<String> errorMessages;
}
