package com.Gestor_Alojamiento.Controller;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.EstablecimientoRepository;
import com.Gestor_Alojamiento.Repositorios.HabitacionRepository;
import com.Gestor_Alojamiento.Servicios.PersonaServicio;
import com.Gestor_Alojamiento.Servicios.ReservaServicio;
import com.Gestor_Alojamiento.DTO.ReservaDTO;

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
    public List<ReservaDTO> getAllReservas() {
        return reservaServicio.findAll().stream()
                .map(reservaServicio::toDTO)
                .toList();
    }

     @GetMapping("/{id}")
    public ResponseEntity<ReservaDTO> getReservaById(@PathVariable int id) {
        Reserva reserva = reservaServicio.findById(id);
        if (reserva == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(reservaServicio.toDTO(reserva));
    }

       @PostMapping(consumes = "application/json")
    public ResponseEntity<?> createReserva(@RequestBody List<ReservaDTO> reservasDTO) {
        try {
            List<Reserva> nuevas = reservaServicio.saveAllFromDTOs(reservasDTO);
            List<ReservaDTO> nuevasDTO = nuevas.stream().map(reservaServicio::toDTO).toList();
            return ResponseEntity.ok(nuevasDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al guardar reserva: " + e.getMessage());
        }
    }


     @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<?> updateReserva(@PathVariable int id, @RequestBody ReservaDTO dto) {
        try {
            Reserva actualizada = reservaServicio.updateFromDTO(id, dto);
            return ResponseEntity.ok(reservaServicio.toDTO(actualizada));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
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
    public List<ReservaDTO> getReservasByPersonaDni(@PathVariable String dni) {
        return reservaServicio.findByPersonaDni(dni).stream()
                .map(reservaServicio::toDTO)
                .toList();
    }

    @GetMapping("/establecimiento/{id}")
    public List<ReservaDTO> getReservasByEstablecimientoId(@PathVariable int id) {
        return reservaServicio.findByEstablecimientoId(id).stream()
                .map(reservaServicio::toDTO)
                .toList();
    }

    @GetMapping("/habitacion/{id}")
    public List<ReservaDTO> getReservasByHabitacionId(@PathVariable int id) {
        return reservaServicio.findByHabitacionId(id).stream()
                .map(reservaServicio::toDTO)
                .toList();
    }

   @GetMapping("/fechas")
    public List<ReservaDTO> getReservasBetweenDates(@RequestParam LocalDateTime fechaEntrada, @RequestParam LocalDateTime fechaSalida) {
        return reservaServicio.findReservasBetweenDates(fechaEntrada, fechaSalida).stream()
                .map(reservaServicio::toDTO)
                .toList();
    }
}