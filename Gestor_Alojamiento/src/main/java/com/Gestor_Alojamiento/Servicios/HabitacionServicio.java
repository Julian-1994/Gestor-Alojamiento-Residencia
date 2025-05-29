package com.Gestor_Alojamiento.Servicios;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Service;
import com.Gestor_Alojamiento.Model.Establecimiento;
import com.Gestor_Alojamiento.Model.Habitacion;
import com.Gestor_Alojamiento.Repositorios.HabitacionRepository;
import DTO.HabitacionDTO;

@Service
public class HabitacionServicio {

	  @Autowired
	    private HabitacionRepository habitacionRepository;

		@Autowired EstablecimientoServicio establecimientoServicio;

	  @EntityGraph(attributePaths = {"reservas"})
	    public List<Habitacion> findAll() {
	        return habitacionRepository.findAll();
	    }

	    public Habitacion findById(int id) {
	        return habitacionRepository.findById(id).orElse(null);
	    }

	    public Habitacion save(Habitacion habitacion) {
	        return habitacionRepository.save(habitacion);
	    }

	    public void deleteById(int id) {
	        habitacionRepository.deleteById(id);
	    }

		public boolean existsById(int id) {
		    return habitacionRepository.existsById(id);
		}

		 // Convertir entidad a DTO
    public HabitacionDTO toDTO(Habitacion h) {
        return new HabitacionDTO(
            h.getId(),
            h.getNumero(),
            h.getTipo(),
            h.getEstado(),
            h.getEstablecimiento() != null ? h.getEstablecimiento().getId() : 0
        );
    }

    // Convertir DTO a entidad
    public Habitacion toEntity(HabitacionDTO dto) {
        Habitacion h = new Habitacion();
        h.setId(dto.getId());
        h.setNumero(dto.getNumero());
        h.setTipo(dto.getTipo());
        h.setEstado(dto.getEstado());

        if (dto.getEstablecimientoId() != 0) {
            Establecimiento est = establecimientoServicio.findById(dto.getEstablecimientoId());
            h.setEstablecimiento(est);
        } else {
            h.setEstablecimiento(null);
        }
        return h;
    }

    // Guardar desde DTO
public Habitacion saveFromDTO(HabitacionDTO dto) {
    Habitacion habitacion = toEntity(dto);
    return save(habitacion);
}

// Editar desde DTO
public Habitacion updateFromDTO(int id, HabitacionDTO dto) {
    if (!existsById(id)) {
        throw new IllegalArgumentException("Habitación no encontrada con ID: " + id);
    }
    Habitacion existente = findById(id);
    if (existente == null) {
        throw new IllegalArgumentException("Habitación no encontrada con ID: " + id);
    }
    existente.setNumero(dto.getNumero());
    existente.setTipo(dto.getTipo());
    existente.setEstado(dto.getEstado());               
    if (dto.getEstablecimientoId() != 0) {
        Establecimiento est = establecimientoServicio.findById(dto.getEstablecimientoId());
        existente.setEstablecimiento(est);
    } else {
        existente.setEstablecimiento(null);
    }
    return save(existente);
}

// Convertir lista de entidades a lista de DTOs
public List<HabitacionDTO> toDTOList(List<Habitacion> habitaciones) {
    return habitaciones.stream()
            .map(this::toDTO)
            .toList();
}

public List<Habitacion> toEntityList(List<HabitacionDTO> dtos) {
    return dtos.stream()
            .map(this::toEntity)
            .toList();
}

    public List<Habitacion> saveAllFromDTOs(List<HabitacionDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            throw new IllegalArgumentException("La lista de habitaciones está vacía o es nula");
        }
        return dtos.stream()
                .map(this::toEntity)
                .map(this::save)
                .toList();
    }   
}
