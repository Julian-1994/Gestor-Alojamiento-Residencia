package com.Gestor_Alojamiento.Batch;

import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.ReservaRepository;
import org.springframework.batch.item.ItemReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Calendar;
import java.util.Date;
import java.util.Iterator;
import java.util.List;

@Component
public class ReservaAntiguaReader implements ItemReader<Reserva> {

    @Autowired
    private ReservaRepository reservaRepository;

    private Iterator<Reserva> iterator;

    @Override
    public Reserva read() {
        if (iterator == null) {
            // Crear fecha de hace 5 años usando Calendar
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.YEAR, -5);
            Date haceCincoAnios = cal.getTime();

            // Buscar reservas con fechaEntrada antes de hace 5 años
            List<Reserva> antiguas = reservaRepository.findByFechaEntradaBefore(haceCincoAnios);
            iterator = antiguas.iterator();
        }
        return iterator != null && iterator.hasNext() ? iterator.next() : null;
    }
}