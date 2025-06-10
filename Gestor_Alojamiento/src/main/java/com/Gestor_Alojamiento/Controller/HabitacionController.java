package com.Gestor_Alojamiento.Controller;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.Gestor_Alojamiento.Model.Habitacion;
import com.Gestor_Alojamiento.Servicios.HabitacionServicio;
import com.Gestor_Alojamiento.DTO.HabitacionDTO;

@RestController
@RequestMapping("/api/habitaciones")
@CrossOrigin(origins = "http://localhost:4200")
public class HabitacionController {

    @Autowired
    private HabitacionServicio habitacionServicio;

   
   @GetMapping
    public ResponseEntity<List<HabitacionDTO>> getAllHabitaciones() {
        List<HabitacionDTO> dtos = habitacionServicio.findAll().stream()
            .map(habitacionServicio::toDTO)
            .collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

       @GetMapping("/{id}")
    public ResponseEntity<HabitacionDTO> getHabitacionById(@PathVariable int id) {
        Habitacion habitacion = habitacionServicio.findById(id);
        if (habitacion == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(habitacionServicio.toDTO(habitacion));
    }

        @PostMapping(consumes = "application/json")
    public ResponseEntity<HabitacionDTO> createHabitacion(@RequestBody HabitacionDTO dto) {
        Habitacion habitacion = habitacionServicio.toEntity(dto);
        Habitacion nuevaHabitacion = habitacionServicio.save(habitacion);
        return ResponseEntity.ok(habitacionServicio.toDTO(nuevaHabitacion));
    }

     @PutMapping(value = "/{id}", consumes = "application/json")
    public ResponseEntity<HabitacionDTO> updateHabitacion(@PathVariable int id, @RequestBody HabitacionDTO dto) {
        if (!habitacionServicio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        Habitacion habitacion = habitacionServicio.toEntity(dto);
        habitacion.setId(id);
        Habitacion actualizadaHabitacion = habitacionServicio.save(habitacion);
        return ResponseEntity.ok(habitacionServicio.toDTO(actualizadaHabitacion));
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
