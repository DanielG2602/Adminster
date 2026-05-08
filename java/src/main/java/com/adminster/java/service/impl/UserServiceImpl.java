package com.adminster.java.service.impl;

import com.adminster.java.domain.Cargo;
import com.adminster.java.domain.User;
import com.adminster.java.dto.request.UserRequest;
import com.adminster.java.dto.response.UserResponse;
import com.adminster.java.exception.ResourceNotFoundException;
import com.adminster.java.exception.ConflictException;
import com.adminster.java.repository.CargoRepository;
import com.adminster.java.repository.UserRepository;
import com.adminster.java.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final CargoRepository cargoRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public UserResponse cadastrar(UserRequest request){
        if(userRepository.existsByEmail(request.email())){
            throw new ConflictException("Email ja cadastrado");
        }

        if (request.cpf() != null && userRepository.existsByCpf(request.cpf())){
            throw new ConflictException("CPF ja cadastrado");
        }

        Cargo cargo = cargoRepository.findById(request.cargoId()).orElseThrow(()-> new ResourceNotFoundException("Cargo nao encontrado"));

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .senha(passwordEncoder.encode(request.senha()))
                .telefone(request.telefone())
                .cpf(request.cpf())
                .dataNascimento(request.dataNascimento())
                .cargo(cargo)
                .role(request.role())
                .ativo(true)
                .build();

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional(readOnly = true)
    public UserResponse buscarPorId(Long id){
        return toResponse(buscarOuLancar(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<UserResponse> listarTodos(Pageable pageable){
        return userRepository.findAllByAtivo(pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public UserResponse atualizar(Long id, UserRequest request){
        User user = buscarOuLancar(id);

        if(!user.getEmail().equals(request.email()) && userRepository.existsByEmail(request.email())){
            throw new ConflictException("Email ja cadastrado");
        }

        Cargo cargo = cargoRepository.findById(request.cargoId()).orElseThrow(()-> new ResourceNotFoundException("Cargo nao encontrado"));

        user.setName(request.name());
        user.setEmail(request.email());
        user.setTelefone(request.telefone());
        user.setCpf(request.cpf());
        user.setDataNascimento(request.dataNascimento());
        user.setCargo(cargo);
        user.setRole(request.role());

        return toResponse(userRepository.save(user));
    }

    @Override
    @Transactional
    public void desativar(Long id){
        User user = buscarOuLancar(id);
        user.setAtivo(false);
        userRepository.save(user);
    }

    @Override
    public UserResponse login (String email, String senha){
        throw new UnsupportedOperationException("User authService");
    }


    private User buscarOuLancar(Long id){
        return userRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Usuario nao encontrado"));
    }

    private UserResponse toResponse(User user) {
        return new UserResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getTelefone(),
            user.getCpf(),
            user.getDataNascimento(),
            user.getCargo().getName(),
            user.getRole(),
            user.getAtivo(),
            user.getCreatedAt()
        );
    }
}
