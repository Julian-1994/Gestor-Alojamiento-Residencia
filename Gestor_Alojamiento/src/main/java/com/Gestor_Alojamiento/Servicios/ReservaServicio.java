package com.Gestor_Alojamiento.Servicios;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.ReservaRepository;

@Service
public class ReservaServicio {

	 @Autowired
	    private ReservaRepository reservaRepository;

	    public List<Reserva> findAll() {
	        return reservaRepository.findAll();
	    }

	    public Reserva findById(int id) {
	        return reservaRepository.findById(id).orElse(null);
	    }

	    public Reserva save(Reserva reserva) {
	        return reservaRepository.save(reserva);
	    }

	    public void deleteById(int id) {
	        reservaRepository.deleteById(id);
	    }

	    public List<Reserva> findByPersonaDni(String dni) {
	        return reservaRepository.findByPersonaDni(dni);
	    }

	    public List<Reserva> findByEstablecimientoId(int establecimientoId) {
	        return reservaRepository.findByEstablecimientoId(establecimientoId);
	    }

	    public List<Reserva> findByHabitacionId(int habitacionId) {
	        return reservaRepository.findByHabitacionId(habitacionId);
	    }

	    public List<Reserva> findReservasBetweenDates(Date fechaEntrada, Date fechaSalida) {
	        return reservaRepository.findReservasBetweenDates(fechaEntrada, fechaSalida);
	    }

		public boolean existsById(int id) {
			return reservaRepository.existsById(id);
		}
}
