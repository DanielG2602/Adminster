package com.adminster.java.service;

import com.adminster.java.dto.request.CargoRequest;
import com.adminster.java.dto.response.CargoResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CargoService {
    CargoResponse cadastrar (CargoRequest request);
    CargoResponse buscarPorId(Long id);
    Page<CargoResponse> listarTodos (Pageable pageable);
    CargoResponse atualizar (Long id, CargoRequest request);
    void desativar (Long id);
}