package com.adminster.java.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

import java.util.List;

public record DepartamentoRequest(
        @NotBlank @Size(min = 2, max = 50) String name,
        List<Long> userIds
) {}
