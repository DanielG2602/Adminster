package com.adminster.java.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CargoRequest(
        @NotBlank String name,
        @Size(max = 255) String description
) {}
