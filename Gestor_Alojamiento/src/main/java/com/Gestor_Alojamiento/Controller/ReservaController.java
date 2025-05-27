package com.Gestor_Alojamiento.Controller;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.Gestor_Alojamiento.Model.Establecimiento;
import com.Gestor_Alojamiento.Model.Habitacion;
import com.Gestor_Alojamiento.Model.Persona;
import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.EstablecimientoRepository;
import com.Gestor_Alojamiento.Repositorios.HabitacionRepository;

import com.Gestor_Alojamiento.Servicios.PersonaServicio;
import com.Gestor_Alojamiento.Servicios.ReservaServicio;

import DTO.ReservaDTO;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaServicio reservaServicio;

    @Autowired EstablecimientoRepository establecimientoRepository;

    @Autowired HabitacionRepository habitacionRepository;

    @Autowired PersonaServicio personaServicio;

    @GetMapping
    public List<Reserva> getAllReservas() {
        return reservaServicio.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reserva> getReservaById(@PathVariable int id) {
        Reserva reserva = reservaServicio.findById(id);
        if (reserva == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reserva);
    }

        @PostMapping(consumes = "application/json")
    public ResponseEntity<?> createReserva(@RequestBody List<ReservaDTO> reservasDTO) {
        if (reservasDTO == null || reservasDTO.isEmpty()) {
            return ResponseEntity.badRequest().body("La lista de reservas está vacía o es nula");
        }

        List<Reserva> nuevasReservas = new ArrayList<>();
    for (ReservaDTO dto : reservasDTO) {
        if (dto.getFechaEntrada().isAfter(dto.getFechaSalida())) {
            return ResponseEntity.badRequest().body("La fecha de entrada no puede ser posterior a la de salida");
        }

        try {
            Reserva reserva = new Reserva();

            // Obtengo persona y valido que exista
            Persona persona = personaServicio.findById(dto.getPersonaDni());
            if (persona == null) {
                return ResponseEntity.badRequest().body("Persona no encontrada con DNI: " + dto.getPersonaDni());
            }
            reserva.setPersona(persona);

            reserva.setFechaEntrada(dto.getFechaEntrada());
            reserva.setFechaSalida(dto.getFechaSalida());
            reserva.setMotivoEntrada(dto.getMotivoEntrada());
            reserva.setObservaciones(dto.getObservaciones());

            Establecimiento est = establecimientoRepository.findById(dto.getEstablecimientoId())
                .orElseThrow(() -> new RuntimeException("Establecimiento no encontrado"));
            Habitacion hab = habitacionRepository.findById(dto.getHabitacionId())
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));

            reserva.setEstablecimiento(est);
            reserva.setHabitacion(hab);

            Reserva nueva = reservaServicio.save(reserva);
            nuevasReservas.add(nueva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al guardar reserva: " + e.getMessage());
        }
    }

    return ResponseEntity.ok(nuevasReservas);
}


   @PutMapping(value = "/{id}", consumes = "application/json")
public ResponseEntity<?> updateReserva(@PathVariable int id, @RequestBody ReservaDTO dto) {
    // Verifica existencia de la reserva
    Reserva reservaExistente = reservaServicio.findById(id);
    if (reservaExistente == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Reserva no encontrada con ID: " + id);
    }

    // Validación de fechas
    if (dto.getFechaEntrada().isAfter(dto.getFechaSalida())) {
        return ResponseEntity.badRequest().body("La fecha de entrada no puede ser posterior a la de salida");
    }

    try {
        // Buscar entidades relacionadas
        Persona persona = personaServicio.findById(dto.getPersonaDni());
        if (persona == null) {
            return ResponseEntity.badRequest().body("Persona no encontrada con DNI: " + dto.getPersonaDni());
        }

        Establecimiento establecimiento = establecimientoRepository.findById(dto.getEstablecimientoId())
                .orElseThrow(() -> new RuntimeException("Establecimiento no encontrado"));

        Habitacion habitacion = habitacionRepository.findById(dto.getHabitacionId())
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));

        // Actualizar los campos
        reservaExistente.setPersona(persona);
        reservaExistente.setEstablecimiento(establecimiento);
        reservaExistente.setHabitacion(habitacion);
        reservaExistente.setFechaEntrada(dto.getFechaEntrada());
        reservaExistente.setFechaSalida(dto.getFechaSalida());
        reservaExistente.setMotivoEntrada(dto.getMotivoEntrada());
        reservaExistente.setObservaciones(dto.getObservaciones());

        // Guardar
        Reserva actualizada = reservaServicio.save(reservaExistente);
        return ResponseEntity.ok(actualizada);

    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Error al actualizar reserva: " + e.getMessage());
    }
}
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReserva(@PathVariable int id) {
        if (!reservaServicio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        reservaServicio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/persona/{dni}")
    public List<Reserva> getReservasByPersonaDni(@PathVariable String dni) {
        return reservaServicio.findByPersonaDni(dni);
    }

    @GetMapping("/establecimiento/{id}")
    public List<Reserva> getReservasByEstablecimientoId(@PathVariable int id) {
        return reservaServicio.findByEstablecimientoId(id);
    }

    @GetMapping("/habitacion/{id}")
    public List<Reserva> getReservasByHabitacionId(@PathVariable int id) {
        return reservaServicio.findByHabitacionId(id);
    }

    @GetMapping("/fechas")
    public List<Reserva> getReservasBetweenDates(@RequestParam LocalDateTime fechaEntrada, @RequestParam LocalDateTime fechaSalida) {
        return reservaServicio.findReservasBetweenDates(fechaEntrada, fechaSalida);
    }
}