package com.Gestor_Alojamiento.Servicios;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.Gestor_Alojamiento.Model.EstadoHabitacion;
import com.Gestor_Alojamiento.Model.Habitacion;
import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.ReservaRepository;

@Service
public class ReservaServicio {

	 @Autowired
	    private ReservaRepository reservaRepository;

		@Autowired
		private HabitacionServicio habitacionServicio;
		
	    public List<Reserva> findAll() {
	        return reservaRepository.findAll();
	    }

	    public Reserva findById(int id) {
	        return reservaRepository.findById(id).orElse(null);
	    }

	      public Reserva save(Reserva reserva) {
        // Validar fechas
        if (reserva.getFechaEntrada().after(reserva.getFechaSalida())) {
            throw new IllegalArgumentException("La fecha de entrada no puede ser posterior a la fecha de salida.");
        }

        // Guardar reserva
        Reserva nuevaReserva = reservaRepository.save(reserva);

        // Actualizar estado de la habitación
        actualizarEstadoHabitacion(reserva.getHabitacion(), reserva.getFechaEntrada(), reserva.getFechaSalida());

        return nuevaReserva;
    }

    private void actualizarEstadoHabitacion(Habitacion habitacion, Date fechaEntrada, Date fechaSalida) {
        // Lógica para cambiar el estado de la habitación
        if (fechaEntrada.before(new Date()) && fechaSalida.after(new Date())) {
            habitacion.setEstado(EstadoHabitacion.OCUPADA);
        } else {
            habitacion.setEstado(EstadoHabitacion.DISPONIBLE);
        }
        habitacionServicio.save(habitacion);
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
