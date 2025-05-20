package com.Gestor_Alojamiento.Servicios;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.stereotype.Service;
import com.Gestor_Alojamiento.Model.Habitacion;
import com.Gestor_Alojamiento.Repositorios.HabitacionRepository;

@Service
public class HabitacionServicio {

	  @Autowired
	    private HabitacionRepository habitacionRepository;

	  @EntityGraph(attributePaths = {"reservas"})
	    public List<Habitacion> findAll() {
	        return habitacionRepository.findAll();
	    }

	    public Habitacion findById(int id) {
	        return habitacionRepository.findById(id).orElse(null);
	    }

	    public Habitacion save(Habitacion habitacion) {
	        return habitacionRepository.save(habitacion);
	    }

	    public void deleteById(int id) {
	        habitacionRepository.deleteById(id);
	    }

		public boolean existsById(int id) {
		    return habitacionRepository.existsById(id);
		}
}
