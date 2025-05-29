package com.Gestor_Alojamiento.Repositorios;
import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import com.Gestor_Alojamiento.Model.Reserva;

public interface ReservaRepository extends JpaRepository<Reserva, Integer> {
    List<Reserva> findByPersonaDni(String dni);

    List<Reserva> findByEstablecimientoId(int establecimientoId);

    List<Reserva> findByHabitacionId(int habitacionId);

    @Query("SELECT r FROM Reserva r WHERE r.fechaEntrada >= :fechaEntrada AND r.fechaSalida <= :fechaSalida")
    List<Reserva> findReservasBetweenDates(@Param("fechaEntrada") LocalDateTime fechaEntrada, @Param("fechaSalida") LocalDateTime fechaSalida);

    List<Reserva> findByFechaEntradaBefore(Date haceCincoAnios);

    void deleteByFechaSalidaBefore(Date fecha);

        List<Reserva> findByFechaSalidaBefore(Date fecha);




}

