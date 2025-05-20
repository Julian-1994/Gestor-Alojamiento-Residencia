package com.Gestor_Alojamiento.Servicios;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Gestor_Alojamiento.Model.Persona;
import com.Gestor_Alojamiento.Repositorios.PersonaRepository;

@Service
public class PersonaServicio {
    @Autowired
    private PersonaRepository personaRepository;

    public List<Persona> findAll() {
        return personaRepository.findAll();
    }

    public Persona findById(String dni) {
        return personaRepository.findById(dni).orElse(null);
    }

    public Persona save(Persona persona) {
        return personaRepository.save(persona);
    }

    public void deleteById(String dni) {
        personaRepository.deleteById(dni);
    }

	public boolean existsById(String dni) {
        return personaRepository.existsById(dni);
	}
}

