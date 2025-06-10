package com.Gestor_Alojamiento.Servicios;
import java.util.Date;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Gestor_Alojamiento.Model.EstadoHabitacion;
import com.Gestor_Alojamiento.Model.Habitacion;
import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.ReservaRepository;

import com.Gestor_Alojamiento.DTO.ReservaDTO;

@Service
public class ReservaServicio {

    @Autowired private ReservaRepository reservaRepository;

    @Autowired private HabitacionServicio habitacionServicio;

    @Autowired private PersonaServicio personaServicio;

    @Autowired private EstablecimientoServicio establecimientoServicio;

    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    public Reserva findById(int id) {
        return reservaRepository.findById(id).orElse(null);
    }

    public Reserva save(Reserva reserva) {
    if (reserva.getFechaEntrada().after(reserva.getFechaSalida())) {
        throw new IllegalArgumentException("La fecha de entrada no puede ser posterior a la fecha de salida.");
    }

    // 1. Verificar o guardar persona
    var persona = reserva.getPersona();
    var personaExistente = personaServicio.findById(persona.getDni());
    if (personaExistente != null) {
        reserva.setPersona(personaExistente);
    } else {
        reserva.setPersona(personaServicio.save(persona));
    }

    // 2. Obtener establecimiento existente
    var establecimiento = establecimientoServicio.findById(reserva.getEstablecimiento().getId());
    if (establecimiento == null) {
        throw new IllegalArgumentException("Establecimiento no encontrado.");
    }
    reserva.setEstablecimiento(establecimiento);

    // 3. Obtener habitación y validar pertenencia al establecimiento
    var habitacion = habitacionServicio.findById(reserva.getHabitacion().getId());
    if (habitacion == null) {
        throw new IllegalArgumentException("Habitación no encontrada.");
    }

if (habitacion.getEstablecimiento().getId() != establecimiento.getId()) {
        throw new IllegalArgumentException("La habitación no pertenece al establecimiento indicado.");
    }
    reserva.setHabitacion(habitacion);

    // 4. Guardar reserva
    Reserva nuevaReserva = reservaRepository.save(reserva);

    // 5. Actualizar estado de la habitación
    actualizarEstadoHabitacion(habitacion, reserva.getFechaEntrada(), reserva.getFechaSalida());

    return nuevaReserva;
}
private void actualizarEstadoHabitacion(Habitacion habitacion, Date fechaEntrada, Date fechaSalida) {
    Date now = new Date();
    if (fechaEntrada.before(now) && fechaSalida.after(now)) {
        habitacion.setEstado(EstadoHabitacion.OCUPADA);
    } else {
        habitacion.setEstado(EstadoHabitacion.DISPONIBLE);
    }
    habitacionServicio.save(habitacion);
}

    public void deleteById(int id) {
        reservaRepository.deleteById(id);
    }

    public List<Reserva> findByPersonaDni(String dni) {
        return reservaRepository.findByPersonaDni(dni);
    }

    public List<Reserva> findByEstablecimientoId(int establecimientoId) {
        return reservaRepository.findByEstablecimientoId(establecimientoId);
    }

    public List<Reserva> findByHabitacionId(int habitacionId) {
        return reservaRepository.findByHabitacionId(habitacionId);
    }

    public List<Reserva> findReservasBetweenDates(LocalDateTime fechaEntrada, LocalDateTime fechaSalida) {
        return reservaRepository.findReservasBetweenDates(fechaEntrada, fechaSalida);
    }

    public boolean existsById(int id) {
        return reservaRepository.existsById(id);
    }

      public ReservaDTO toDTO(Reserva reserva) {
        ReservaDTO dto = new ReservaDTO();
        dto.setId(reserva.getId());
        dto.setPersonaDni(reserva.getPersona().getDni());
        dto.setEstablecimientoId(reserva.getEstablecimiento().getId());
        dto.setHabitacionId(reserva.getHabitacion().getId());
        dto.setFechaEntrada(reserva.getFechaEntrada());
        dto.setFechaSalida(reserva.getFechaSalida());
        dto.setMotivoEntrada(reserva.getMotivoEntrada());
        dto.setObservaciones(reserva.getObservaciones());
        return dto;
    }

    public Reserva toEntity(ReservaDTO dto) {
        Reserva reserva = new Reserva();
            
        reserva.setId(dto.getId()); // Añade esta línea
        reserva.setFechaEntrada(dto.getFechaEntrada());
        reserva.setFechaSalida(dto.getFechaSalida());
        reserva.setMotivoEntrada(dto.getMotivoEntrada());
        reserva.setObservaciones(dto.getObservaciones());

        // Relaciones
        var persona = personaServicio.findById(dto.getPersonaDni());
        if (persona == null) throw new IllegalArgumentException("Persona no encontrada con DNI: " + dto.getPersonaDni());
        reserva.setPersona(persona);

        var establecimiento = establecimientoServicio.findById(dto.getEstablecimientoId());
        if (establecimiento == null) throw new IllegalArgumentException("Establecimiento no encontrado.");
        reserva.setEstablecimiento(establecimiento);

        var habitacion = habitacionServicio.findById(dto.getHabitacionId());
        if (habitacion == null) throw new IllegalArgumentException("Habitación no encontrada.");
        reserva.setHabitacion(habitacion);

        return reserva;
    }

      public Reserva saveFromDTO(ReservaDTO dto) {
        Reserva reserva = toEntity(dto);
        return save(reserva);
    }

     public List<Reserva> saveAllFromDTOs(List<ReservaDTO> dtos) {
        if (dtos == null || dtos.isEmpty()) {
            throw new IllegalArgumentException("La lista de reservas está vacía o es nula");
        }

        return dtos.stream()
                .map(this::toEntity)
                .map(this::save)
                .collect(Collectors.toList());
    }

    public Reserva updateFromDTO(int id, ReservaDTO dto) {
        Reserva existente = findById(id);
        if (existente == null) {
            throw new RuntimeException("Reserva no encontrada con ID: " + id);
        }

        if (dto.getFechaEntrada().after(dto.getFechaSalida())) {
            throw new IllegalArgumentException("La fecha de entrada no puede ser posterior a la de salida");
        }

        existente.setFechaEntrada(dto.getFechaEntrada());
        existente.setFechaSalida(dto.getFechaSalida());
        existente.setMotivoEntrada(dto.getMotivoEntrada());
        existente.setObservaciones(dto.getObservaciones());

        var persona = personaServicio.findById(dto.getPersonaDni());
        if (persona == null) throw new IllegalArgumentException("Persona no encontrada con DNI: " + dto.getPersonaDni());
        existente.setPersona(persona);

        var establecimiento = establecimientoServicio.findById(dto.getEstablecimientoId());
        if (establecimiento == null) throw new IllegalArgumentException("Establecimiento no encontrado");
        existente.setEstablecimiento(establecimiento);

        var habitacion = habitacionServicio.findById(dto.getHabitacionId());
        if (habitacion == null) throw new IllegalArgumentException("Habitación no encontrada");
        existente.setHabitacion(habitacion);

        return save(existente);
    }
    
    public List<ReservaDTO> toDTOList(List<Reserva> reservas) {
        return reservas.stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<Reserva> toEntityList(List<ReservaDTO> dtos) {
        return dtos.stream()
                .map(this::toEntity)
                .collect(Collectors.toList());
    }


}