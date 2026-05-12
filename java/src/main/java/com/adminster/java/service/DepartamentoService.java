package com.adminster.java.service;

import com.adminster.java.dto.request.DepartamentoRequest;
import com.adminster.java.dto.response.DepartamentoResponse;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import org.springframework.data.domain.Pageable;

public interface DepartamentoService {
    DepartamentoResponse cadastrar (DepartamentoRequest request);
    DepartamentoResponse buscarPorId (Long id);
    DepartamentoResponse atualizar (Long id, DepartamentoRequest request);
    Page<DepartamentoResponse> listarTodos (Pageable pageable);
    Page<DepartamentoResponse> listarPorUser (Long userId, Pageable pageable);
    void desativar (Long id);
}
