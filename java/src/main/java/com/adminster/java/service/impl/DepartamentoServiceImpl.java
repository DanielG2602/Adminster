package com.adminster.java.service.impl;

import com.adminster.java.domain.Departamento;
import com.adminster.java.domain.User;
import com.adminster.java.dto.request.DepartamentoRequest;
import com.adminster.java.dto.response.DepartamentoResponse;
import com.adminster.java.exception.ConflictException;
import com.adminster.java.exception.ResourceNotFoundException;
import com.adminster.java.repository.DepartamentoRepository;
import com.adminster.java.repository.UserRepository;
import com.adminster.java.service.DepartamentoService;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;

import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class DepartamentoServiceImpl implements DepartamentoService {

    private final DepartamentoRepository departamentoRepository;
    private final UserRepository userRepository;

    @Override
    @Transactional
    public DepartamentoResponse cadastrar (DepartamentoRequest request){
        if(departamentoRepository.existsByName(request.name())){
            throw new ConflictException("Departamento ja cadastrado");
        }

        List<User> users = userRepository.findAllById(request.userIds());

        users.forEach(user -> {
            if(user.getDepartamento() != null){
                throw new ConflictException("User" + user.getName() +" ja cadastrado no departamento");
            }
        });

        Departamento departamento = Departamento.builder()
                .name(request.name())
                .ativo(true)
                .build();

        Departamento saved = departamentoRepository.save(departamento);

        users.forEach(user -> user.setDepartamento(saved));
        userRepository.saveAll(users);

        return toResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DepartamentoResponse> listarTodos (Pageable pageable){
        return departamentoRepository.findByAtivoTrue(pageable).map(this::toResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public DepartamentoResponse buscarPorId (Long id){
        return toResponse(buscarOrLancar(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<DepartamentoResponse> listarPorUser(Long userId, Pageable pageable) {
        if (!userRepository.existsById(userId)) {
            throw new ResourceNotFoundException("Usuario nao encontrado");
        }
        return departamentoRepository.findByUsersId(userId, pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public DepartamentoResponse atualizar (Long id, DepartamentoRequest request){
        Departamento departamento = buscarOrLancar(id);

        List<User> users = userRepository.findAllById(request.userIds());

        users.forEach(user -> {
            if(user.getDepartamento() != null){
                throw new ConflictException("User" + user.getName() +" ja cadastrado no departamento");
            }
        });

        if (!departamento.getName().equals(request.name())
                && departamentoRepository.existsByName(request.name())) {
            throw new ConflictException("Departamento ja cadastrado");
        }

        departamento.getUser().forEach(user -> user.setDepartamento(null));
        userRepository.saveAll(departamento.getUser());

        departamento.setName(request.name());
        Departamento saved = departamentoRepository.save(departamento);

        users.forEach(user -> user.setDepartamento(saved));
        userRepository.saveAll(users);

        return toResponse(saved);
    }

    @Override
    @Transactional
    public void desativar (Long id){
        Departamento departamento = buscarOrLancar(id);
        departamento.setAtivo(false);
        departamentoRepository.save(departamento);
    }

    private Departamento buscarOrLancar (Long id){
        return departamentoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Departamento nao encontrado"));
    }

    private DepartamentoResponse toResponse(Departamento departamento){
        return new DepartamentoResponse(
          departamento.getId(),
          departamento.getName(),
          departamento.getUser() != null ? departamento.getUser().stream().map(User::getId).toList() : List.of(),
          departamento.getCreatedAt()
        );
    }
}
