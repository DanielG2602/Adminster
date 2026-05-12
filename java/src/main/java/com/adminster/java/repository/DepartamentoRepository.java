package com.adminster.java.repository;

import com.adminster.java.domain.Departamento;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DepartamentoRepository extends JpaRepository <Departamento, Long> {
    Optional<Departamento> findByName(String name);
    boolean existsByName(String name);
    Page<Departamento> findByAtivoTrue (Pageable pageable);
    boolean existsByUsers_Id(Long userId);
    Page<Departamento> findByUsersId(Long userId, Pageable pageable);

}
