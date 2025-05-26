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

            // Buscar Persona
            Persona persona = personaServicio.findById(dto.getPersonaDni());
            if (persona == null) {
                return ResponseEntity.badRequest().body("Persona no encontrada con DNI: " + dto.getPersonaDni());
            }
            reserva.setPersona(persona);

            // Buscar Establecimiento
            Establecimiento est = establecimientoRepository.findById(dto.getEstablecimientoId())
                .orElseThrow(() -> new RuntimeException("Establecimiento no encontrado"));
            reserva.setEstablecimiento(est);

            // Buscar Habitacion
            Habitacion hab = habitacionRepository.findById(dto.getHabitacionId())
                .orElseThrow(() -> new RuntimeException("Habitación no encontrada"));
            reserva.setHabitacion(hab);

            // Setear fechas y campos
            reserva.setFechaEntrada(dto.getFechaEntrada());
            reserva.setFechaSalida(dto.getFechaSalida());
            reserva.setMotivoEntrada(dto.getMotivoEntrada());
            reserva.setObservaciones(dto.getObservaciones());

            // Guardar reserva
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
    public ResponseEntity<Reserva> updateReserva(@PathVariable int id, @RequestBody Reserva reserva) {
        if (!reservaServicio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (reserva.getFechaEntrada().isAfter(reserva.getFechaSalida())) {
            return ResponseEntity.badRequest().body(null);
        }
        reserva.setId(id);
        try {
            Reserva actualizadaReserva = reservaServicio.save(reserva);
            return ResponseEntity.ok(actualizadaReserva);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
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