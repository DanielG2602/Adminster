package com.adminster.java.repository;

import com.adminster.java.domain.Cargo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CargoRepository extends JpaRepository<Cargo, Long> {
    Boolean existsPorNome(String name);
    Optional<Cargo> findByName(String name);
}
