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
import com.Gestor_Alojamiento.Model.Establecimiento;
import com.Gestor_Alojamiento.Servicios.EstablecimientoServicio;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/establecimientos")
public class EstablecimientoController {

	  @Autowired
	    private EstablecimientoServicio establecimientoServicio;

	    @GetMapping
	    public List<Establecimiento> getAllEstablecimientos() {
	        return establecimientoServicio.findAll();
	    }

	    @GetMapping("{id}")
	    public ResponseEntity<Establecimiento> getEstablecimientoById(@PathVariable int id) {
	        Establecimiento establecimiento = establecimientoServicio.findById(id);
	        if (establecimiento == null) {
	            return ResponseEntity.notFound().build();
	        }
	        return ResponseEntity.ok(establecimiento);
	    }


	    @PostMapping (consumes = "application/json")
	    public ResponseEntity<Establecimiento> createEstablecimiento(@RequestBody Establecimiento establecimiento) {
	        Establecimiento nuevoEstablecimiento = establecimientoServicio.save(establecimiento);
	        return ResponseEntity.ok(nuevoEstablecimiento);
	    }

	    @PutMapping (value = "/{id}", consumes = "application/json")
	    public ResponseEntity<Establecimiento> updateEstablecimiento(@PathVariable int id, @RequestBody Establecimiento establecimiento) {
	        if (!establecimientoServicio.existsById(id)) {
	            return ResponseEntity.notFound().build();
	        }
	        establecimiento.setId(id);
	        Establecimiento actualizadoEstablecimiento = establecimientoServicio.save(establecimiento);
	        return ResponseEntity.ok(actualizadoEstablecimiento);
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
