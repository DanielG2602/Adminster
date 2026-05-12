package com.adminster.java.dto.response;

import java.time.LocalDateTime;
import java.util.List;

public record DepartamentoResponse(
   Long id,
   String name,
   List<Long> userIds,
   LocalDateTime createdAt
) {}
