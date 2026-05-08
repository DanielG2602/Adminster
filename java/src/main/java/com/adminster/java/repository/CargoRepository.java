package com.adminster.java.repository;

import com.adminster.java.domain.Cargo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {
    Boolean existsByName(String name);
    Optional<Cargo> findByName(String name);
    Page<Cargo> findAllByAtivoTrue(Pageable pageable);
}
