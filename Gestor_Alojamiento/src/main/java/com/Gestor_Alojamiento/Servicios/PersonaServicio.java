package com.Gestor_Alojamiento.Servicios;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Gestor_Alojamiento.Model.Persona;
import com.Gestor_Alojamiento.Repositorios.PersonaRepository;

import DTO.PersonaDTO;

@Service
public class PersonaServicio {
    @Autowired
    private PersonaRepository personaRepository;

    public List<Persona> findAll() {
        return personaRepository.findAll();
    }

    public Persona findById(String dni) {
        return personaRepository.findById(dni).orElse(null);
    }

    public Persona save(Persona persona) {
        return personaRepository.save(persona);
    }

    public void deleteById(String dni) {
        personaRepository.deleteById(dni);
    }

	public boolean existsById(String dni) {
        return personaRepository.existsById(dni);
	}

    // Conversión de entidad a DTO
    public PersonaDTO toDTO(Persona persona) {
        PersonaDTO dto = new PersonaDTO();
        dto.setDni(persona.getDni());
        dto.setNombre(persona.getNombre());
        dto.setApellidos(persona.getApellidos());
        dto.setTelefono(persona.getTelefono());
        dto.setEmail(persona.getEmail());
        // Añade más campos si tu DTO los tiene
        return dto;
    }

    // Conversión de DTO a entidad
    public Persona toEntity(PersonaDTO dto) {
        Persona persona = new Persona();
        persona.setDni(dto.getDni());
        persona.setNombre(dto.getNombre());
        persona.setApellidos(dto.getApellidos());
        persona.setTelefono(dto.getTelefono());
        persona.setEmail(dto.getEmail());
        // Añade más campos si tu entidad los tiene
        return persona;
    }

    // Guardar desde DTO
    public Persona saveFromDTO(PersonaDTO dto) {
        Persona persona = toEntity(dto);
        return save(persona);
    }

    // Editar desde DTO
    public Persona updateFromDTO(String dni, PersonaDTO dto) {
        Persona existente = findById(dni);
        if (existente == null) {
            throw new RuntimeException("Persona no encontrada con DNI: " + dni);
        }
        existente.setNombre(dto.getNombre());
        existente.setApellidos(dto.getApellidos());
        existente.setTelefono(dto.getTelefono());
        existente.setEmail(dto.getEmail());
        // Añade más campos si tu DTO/entidad los tiene
        return save(existente);
    }
    public List<PersonaDTO> toDTOList(List<Persona> personas) {
        return personas.stream()
                .map(this::toDTO)
                .toList();
    }

    public List<Persona> toEntityList(List<PersonaDTO> dtos) {
        return dtos.stream()
                .map(this::toEntity)
                .toList();
    }

    public List<Persona> saveAllFromDTOs(List<PersonaDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            throw new IllegalArgumentException("La lista de personas está vacía o es nula");
        }

        return dtos.stream()
                .map(this::toEntity)
                .map(this::save)
                .toList();
    }

    
}

