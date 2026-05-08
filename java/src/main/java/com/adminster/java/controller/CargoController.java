package com.adminster.java.controller;

import com.adminster.java.dto.request.CargoRequest;
import com.adminster.java.dto.response.CargoResponse;
import com.adminster.java.service.CargoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/v1/cargos")
@RequiredArgsConstructor
public class CargoController {
    private final CargoService cargoService;

    @PostMapping
    public ResponseEntity<CargoResponse> cadastrar (@RequestBody @Valid CargoRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(cargoService.cadastrar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<CargoResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(cargoService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<Page<CargoResponse>> listarTodos (@PageableDefault(size = 20,sort = "name")Pageable pageable){
        return ResponseEntity.ok(cargoService.listarTodos(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CargoResponse> atualizar (@PathVariable Long id, @RequestBody @Valid CargoRequest request){
        return ResponseEntity.ok(cargoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar (@PathVariable Long id){
        cargoService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
