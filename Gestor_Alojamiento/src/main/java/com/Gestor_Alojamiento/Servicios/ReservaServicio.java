package com.Gestor_Alojamiento.Servicios;

import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Gestor_Alojamiento.Model.EstadoHabitacion;
import com.Gestor_Alojamiento.Model.Habitacion;
import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.ReservaRepository;

@Service
public class ReservaServicio {

    @Autowired
    private ReservaRepository reservaRepository;

    @Autowired
    private HabitacionServicio habitacionServicio;

    @Autowired private PersonaServicio personaServicio;

    @Autowired private EstablecimientoServicio establecimientoServicio;

    public List<Reserva> findAll() {
        return reservaRepository.findAll();
    }

    public Reserva findById(int id) {
        return reservaRepository.findById(id).orElse(null);
    }

    public Reserva save(Reserva reserva) {
    if (reserva.getFechaEntrada().isAfter(reserva.getFechaSalida())) {
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
private void actualizarEstadoHabitacion(Habitacion habitacion, LocalDateTime fechaEntrada, LocalDateTime fechaSalida) {
    LocalDateTime now = LocalDateTime.now();
    if (fechaEntrada.isBefore(now) && fechaSalida.isAfter(now)) {
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
}