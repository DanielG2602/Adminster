package com.adminster.java.repository;

import com.adminster.java.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Boolean existsByEmail(String email);
    Boolean existsByCpf(String cpf);
    Page<User> findAllByAtivoTrue(Pageable pageable);
    Page<User> findByDepartamentoId (Long departamentoId, Pageable pageable);
}