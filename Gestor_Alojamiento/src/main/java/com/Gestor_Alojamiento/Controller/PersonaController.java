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
import com.Gestor_Alojamiento.Servicios.PersonaServicio;

import DTO.PersonaDTO;

@RestController
@RequestMapping("/api/personas")
@CrossOrigin(origins = "http://localhost:4200")
public class PersonaController {

	 @Autowired
	    private PersonaServicio personaServicio;

	   @GetMapping
    public List<PersonaDTO> getAllPersonas() {
        return personaServicio.toDTOList(personaServicio.findAll());
    }

	   @GetMapping("/{dni}")
    public ResponseEntity<PersonaDTO> getPersonaByDni(@PathVariable String dni) {
        var persona = personaServicio.findById(dni);
        if (persona == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(personaServicio.toDTO(persona));
    }
	   @PostMapping(consumes = "application/json")
    public ResponseEntity<PersonaDTO> createPersona(@RequestBody PersonaDTO personaDTO) {
        var nuevaPersona = personaServicio.saveFromDTO(personaDTO);
        return ResponseEntity.ok(personaServicio.toDTO(nuevaPersona));
    }

    @PutMapping(value = "/{dni}", consumes = "application/json")
    public ResponseEntity<PersonaDTO> updatePersona(@PathVariable String dni, @RequestBody PersonaDTO personaDTO) {
        if (!personaServicio.existsById(dni)) {
            return ResponseEntity.notFound().build();
        }
        var actualizadaPersona = personaServicio.updateFromDTO(dni, personaDTO);
        return ResponseEntity.ok(personaServicio.toDTO(actualizadaPersona));
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
