package com.Gestor_Alojamiento.Controller;
import java.util.List;
import java.util.stream.Collectors;
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
import com.Gestor_Alojamiento.Model.Establecimiento;
import com.Gestor_Alojamiento.Servicios.EstablecimientoServicio;
import com.Gestor_Alojamiento.DTO.EstablecimientoDTO;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/establecimientos")
public class EstablecimientoController {

	 @Autowired
    private EstablecimientoServicio establecimientoServicio;

    
     @GetMapping
    public List<EstablecimientoDTO> getAllEstablecimientos() {
        return establecimientoServicio.findAll().stream()
                .map(establecimientoServicio::toDTO)
                .collect(Collectors.toList());
    }

     @GetMapping("/{id}")
    public ResponseEntity<EstablecimientoDTO> getEstablecimientoById(@PathVariable int id) {
        Establecimiento e = establecimientoServicio.findById(id);
        if (e == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(establecimientoServicio.toDTO(e));
    }

    @PostMapping
	public ResponseEntity<EstablecimientoDTO> createEstablecimiento(@RequestBody EstablecimientoDTO dto) {
    Establecimiento nuevo = establecimientoServicio.saveFromDTO(dto);
    return ResponseEntity.ok(establecimientoServicio.toDTO(nuevo));
}

      @PutMapping("/{id}")
public ResponseEntity<EstablecimientoDTO> updateEstablecimiento(@PathVariable int id, @RequestBody EstablecimientoDTO dto) {
    if (!establecimientoServicio.existsById(id)) {
        return ResponseEntity.notFound().build();
    }
    Establecimiento actualizado = establecimientoServicio.updateFromDTO(id, dto);
    return ResponseEntity.ok(establecimientoServicio.toDTO(actualizado));
}


     @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEstablecimiento(@PathVariable int id) {
        if (!establecimientoServicio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        establecimientoServicio.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}

