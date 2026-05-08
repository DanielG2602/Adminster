package com.adminster.java.dto.request;

import com.adminster.java.domain.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record UserRequest(
        @NotBlank @Size(min = 2, max = 100) String name,
        @NotBlank @Email String email,
        @NotBlank String senha,
        @NotBlank @Pattern(regexp =  "^\\+?[0-9]{10,15}$", message = "Telefone Invalido") String telefone,
        String cpf,
        LocalDate dataNascimento,
        Long cargoId,
        Role role
) {}