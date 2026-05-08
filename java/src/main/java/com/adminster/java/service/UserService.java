package com.adminster.java.service;

import com.adminster.java.dto.request.UserRequest;
import com.adminster.java.dto.response.UserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserResponse cadastrar(UserRequest request);
    UserResponse login(String email, String senha);
    UserResponse buscarPorId(Long id);
    Page<UserResponse> listarTodos(Pageable pageable);
    UserResponse atualizar (Long id, UserRequest request);
    void desativar(Long id);
}