package com.adminster.java.controller;

import com.adminster.java.dto.request.DepartamentoRequest;
import com.adminster.java.dto.response.DepartamentoResponse;
import com.adminster.java.service.DepartamentoService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/departamentos")
@RequiredArgsConstructor
public class DepartamentoController {

    private final DepartamentoService departamentoService;

    @PostMapping
    public ResponseEntity<DepartamentoResponse> cadastrar (@RequestBody @Valid DepartamentoRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(departamentoService.cadastrar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<DepartamentoResponse> buscarPorId (@PathVariable Long id){
        return ResponseEntity.ok(departamentoService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<Page<DepartamentoResponse>> listarTodos (@PageableDefault(size = 20, sort = "name") Pageable pageable){
        return ResponseEntity.ok(departamentoService.listarTodos(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<DepartamentoResponse> atualizar (@PathVariable Long id, @RequestBody DepartamentoRequest request){
        return ResponseEntity.ok(departamentoService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar (@PathVariable Long id){
        departamentoService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
