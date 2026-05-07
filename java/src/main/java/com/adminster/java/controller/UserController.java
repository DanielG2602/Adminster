package com.adminster.java.controller;

import com.adminster.java.dto.request.UserRequest;
import com.adminster.java.dto.response.UserResponse;
import com.adminster.java.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Pageable;

@RestController
@RequestMapping("/api/v1/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping
    public ResponseEntity<UserResponse> cadastrar (@RequestBody @Valid UserRequest request){
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.cadastrar(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserResponse> buscarPorId(@PathVariable Long id){
        return ResponseEntity.ok(userService.buscarPorId(id));
    }

    @GetMapping
    public ResponseEntity<Page<UserResponse>> listarTodos(@PageableDefault(size = 20, sort = "name") Pageable pageable) {
        return ResponseEntity.ok(userService.listarTodos(pageable));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserResponse> atualizar (@PathVariable Long id, @RequestBody @Valid UserRequest request){
        return ResponseEntity.ok(userService.atualizar(id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> desativar(@PathVariable Long id){
        userService.desativar(id);
        return ResponseEntity.noContent().build();
    }
}
