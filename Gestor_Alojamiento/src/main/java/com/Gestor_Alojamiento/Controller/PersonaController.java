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
import com.Gestor_Alojamiento.Model.Persona;
import com.Gestor_Alojamiento.Servicios.PersonaServicio;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "http://localhost:4200")
public class PersonaController {

	 @Autowired
	    private PersonaServicio personaServicio;

	    @GetMapping
	    public List<Persona> getAllPersonas() {
	        return personaServicio.findAll();
	    }

	    @GetMapping("/{dni}")
	    public ResponseEntity<Persona> getPersonaByDni(@PathVariable String dni) {
	        Persona persona = personaServicio.findById(dni);
	        if (persona == null) {
	            return ResponseEntity.notFound().build();
	        }
	        return ResponseEntity.ok(persona);
	    }

	    @PostMapping (consumes = "application/json")
	    public ResponseEntity<Persona> createPersona(@RequestBody Persona persona) {
	        Persona nuevaPersona = personaServicio.save(persona);
	        return ResponseEntity.ok(nuevaPersona);
	    }


	    @PutMapping (value = "/{dni}", consumes = "application/json")
	    public ResponseEntity<Persona> updatePersona(@PathVariable String dni, @RequestBody Persona persona) {
	        if (!personaServicio.existsById(dni)) {
	            return ResponseEntity.notFound().build();
	        }
	        persona.setDni(dni);
	        Persona actualizadaPersona = personaServicio.save(persona);
	        return ResponseEntity.ok(actualizadaPersona);
	    }

	    @DeleteMapping("/{dni}")
	    public ResponseEntity<Void> deletePersona(@PathVariable String dni) {
	        if (!personaServicio.existsById(dni)) {
	            return ResponseEntity.notFound().build();
	        }
	        personaServicio.deleteById(dni);
	        return ResponseEntity.noContent().build();
	    }
}
