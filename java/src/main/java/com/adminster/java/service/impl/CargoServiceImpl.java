package com.adminster.java.service.impl;

import com.adminster.java.domain.Cargo;
import com.adminster.java.dto.request.CargoRequest;
import com.adminster.java.dto.response.CargoResponse;
import com.adminster.java.exception.ConflictException;
import com.adminster.java.exception.ResourceNotFoundException;
import com.adminster.java.repository.CargoRepository;
import com.adminster.java.service.CargoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@RequiredArgsConstructor
public class CargoServiceImpl implements CargoService {

    private final CargoRepository cargoRepository;


    @Override
    @Transactional
    public CargoResponse cadastrar (CargoRequest request){
        if(cargoRepository.existsByName(request.name())){
            throw new ConflictException("Cargo ja cadastrado");
        }

        Cargo cargo = Cargo.builder()
                .name(request.name())
                .description(request.description())
                .ativo(true)
                .build();

        return toResponse(cargoRepository.save(cargo));
    }

    @Override
    @Transactional(readOnly = true)
    public CargoResponse buscarPorId(Long id){
        return toResponse(buscarOuLancar(id));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CargoResponse> listarTodos (Pageable pageable){
        return cargoRepository.findAllByAtivoTrue(pageable).map(this::toResponse);
    }

    @Override
    @Transactional
    public CargoResponse atualizar(Long id, CargoRequest request){
        Cargo cargo = buscarOuLancar(id);

        if (!cargo.getName().equals(request.name()) && cargoRepository.existsByName(request.name())){
            throw new ConflictException("Cargo ja cadastrado");
        }

        cargo.setName(request.name());
        cargo.setDescription(request.description());

        return toResponse(cargoRepository.save(cargo));

    }

    @Override
    @Transactional
    public void desativar(Long id){
        Cargo cargo = buscarOuLancar(id);
        cargo.setAtivo(false);
        cargoRepository.save(cargo);
    }

    private Cargo buscarOuLancar(Long id){
        return cargoRepository.findById(id).orElseThrow(()-> new ResourceNotFoundException("Cargo nao encontrado"));
    }

    private CargoResponse toResponse (Cargo cargo){
        return new CargoResponse(
                cargo.getId(),
                cargo.getName(),
                cargo.getDescription(),
                cargo.getAtivo(),
                cargo.getCreatedAt()
        );
    }
}
