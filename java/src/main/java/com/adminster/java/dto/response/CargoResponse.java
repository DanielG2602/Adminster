package com.adminster.java.dto.response;

import java.time.LocalDateTime;

public record CargoResponse(
   Long id,
   String name,
   String description,
   Boolean ativo,
   LocalDateTime createdAt
) {}
