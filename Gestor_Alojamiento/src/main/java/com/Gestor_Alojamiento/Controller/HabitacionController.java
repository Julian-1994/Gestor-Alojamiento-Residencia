package com.Gestor_Alojamiento.Controller;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.Gestor_Alojamiento.Model.Habitacion;
import com.Gestor_Alojamiento.Servicios.HabitacionServicio;

@RestController
@RequestMapping("/api/habitaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class HabitacionController {

	@Autowired
    private HabitacionServicio habitacionServicio;

    @GetMapping
    public ResponseEntity<List<Habitacion>> getAllHabitaciones() {
        return ResponseEntity.ok(habitacionServicio.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Habitacion> getHabitacionById(@PathVariable int id) {
        Habitacion habitacion = habitacionServicio.findById(id);
        if (habitacion == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(habitacion);
    }

    @PostMapping
    public ResponseEntity<Habitacion> createHabitacion(@RequestBody Habitacion habitacion) {
        Habitacion nuevaHabitacion = habitacionServicio.save(habitacion);
        return ResponseEntity.ok(nuevaHabitacion);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Habitacion> updateHabitacion(@PathVariable int id, @RequestBody Habitacion habitacion) {
        if (!habitacionServicio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        habitacion.setId(id);
        Habitacion actualizadaHabitacion = habitacionServicio.save(habitacion);
        return ResponseEntity.ok(actualizadaHabitacion);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteHabitacion(@PathVariable int id) {
        if (!habitacionServicio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        habitacionServicio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
