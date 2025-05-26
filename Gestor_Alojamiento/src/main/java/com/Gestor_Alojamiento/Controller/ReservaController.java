package com.Gestor_Alojamiento.Controller;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Servicios.EstablecimientoServicio;
import com.Gestor_Alojamiento.Servicios.ReservaServicio;



@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/reservas")
public class ReservaController {

    @Autowired
    private ReservaServicio reservaServicio;

    @Autowired EstablecimientoServicio establecimientoServicio;

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

  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
public ResponseEntity<Reserva> createReserva(@RequestBody Reserva reserva) {
    if (reserva.getFechaEntrada().after(reserva.getFechaSalida())) {
        return ResponseEntity.badRequest().body(null);
    }
    try {
        Reserva nuevaReserva = reservaServicio.save(reserva);
        return ResponseEntity.ok(nuevaReserva);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}

    @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<Reserva> updateReserva(@PathVariable int id, @RequestBody Reserva reserva) {
        if (!reservaServicio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (reserva.getFechaEntrada().after(reserva.getFechaSalida())) {
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
    public List<Reserva> getReservasBetweenDates(@RequestParam Date fechaEntrada, @RequestParam Date fechaSalida) {
        return reservaServicio.findReservasBetweenDates(fechaEntrada, fechaSalida);
    }
}