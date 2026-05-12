package com.adminster.java.dto.response;

import com.adminster.java.domain.Departamento;
import com.adminster.java.domain.enums.Role;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        String telefone,
        String cpf,
        LocalDate dataNascimento,
        String cargoNome,
        Role role,
        Boolean ativo,
        String departamentoName,
        LocalDateTime createdAt
) {}
