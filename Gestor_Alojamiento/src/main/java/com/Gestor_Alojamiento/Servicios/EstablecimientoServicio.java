package com.Gestor_Alojamiento.Servicios;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Gestor_Alojamiento.Model.Establecimiento;
import com.Gestor_Alojamiento.Model.Habitacion;
import com.Gestor_Alojamiento.Repositorios.EstablecimientoRepository;

import com.Gestor_Alojamiento.DTO.EstablecimientoDTO;


@Service
public class EstablecimientoServicio {

	@Autowired
    private EstablecimientoRepository establecimientoRepository;

    public List<Establecimiento> findAll() {
        return establecimientoRepository.findAll();
    }

    public Establecimiento findById(Integer id) {
        return establecimientoRepository.findById(id).orElse(null);
    }

    public Establecimiento save(Establecimiento establecimiento) {
        return establecimientoRepository.save(establecimiento);
    }

    public void deleteById(int id) {
        establecimientoRepository.deleteById(id);
    }

	public boolean existsById(int id) {
	    return establecimientoRepository.existsById(id);
	}

    // Mapper para convertir entidad a DTO y viceversa
    public EstablecimientoDTO toDTO(Establecimiento e) {
        List<Integer> habitacionIds = e.getHabitaciones() == null ? 
            Collections.emptyList() :
            e.getHabitaciones().stream()
                .map(Habitacion::getId)
                .collect(Collectors.toList());

        return new EstablecimientoDTO(
            e.getId(),
            e.getNombre(),
            e.getDireccion(),
            e.getTelefono(),
            e.getCapacidad(),
            habitacionIds
        );
    }

    public Establecimiento toEntity(EstablecimientoDTO dto) {
        Establecimiento e = new Establecimiento();
        e.setId(dto.getId());
        e.setNombre(dto.getNombre());
        e.setDireccion(dto.getDireccion());
        e.setTelefono(dto.getTelefono());
        e.setCapacidad(dto.getCapacidad());

        // Por ahora dejamos habitaciones vacías (se pueden asignar después)
        e.setHabitaciones(Collections.emptyList());

        return e;
    }

    public Establecimiento saveFromDTO(EstablecimientoDTO dto) {
    return save(toEntity(dto));
}

public Establecimiento updateFromDTO(int id, EstablecimientoDTO dto) {
    Establecimiento existente = findById(id);
    if (existente == null) {
        throw new RuntimeException("Establecimiento no encontrado");
    }
    existente.setNombre(dto.getNombre());
    existente.setDireccion(dto.getDireccion());
    existente.setTelefono(dto.getTelefono());   
    existente.setCapacidad(dto.getCapacidad());
    return save(existente);
}

    public List<EstablecimientoDTO> toDTOList(List<Establecimiento> establecimientos) {
        return establecimientos.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<Establecimiento> toEntityList(List<EstablecimientoDTO> dtos) {
    return dtos.stream()
            .map(this::toEntity)
            .toList();
}

    public List<Establecimiento> saveAllFromDTOs(List<EstablecimientoDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            throw new IllegalArgumentException("La lista de establecimientos está vacía o es nula");
        }

        return dtos.stream()
                .map(this::toEntity)
                .map(this::save)
                .collect(Collectors.toList());
    }
}
