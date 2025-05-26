package com.Gestor_Alojamiento.Batch;

import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.ReservaRepository;

import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


@Component
public class ReservaAntiguaWriter implements ItemWriter<Reserva> {

    @Autowired
    private ReservaRepository reservaRepository;


    @Override
    public void write(Chunk<? extends Reserva> items) throws Exception {
                // Borra todas las reservas recibidas
        reservaRepository.deleteAll(items);
        System.out.println("Reservas eliminadas: " + items.size());
        throw new UnsupportedOperationException("Unimplemented method 'write'");
    }
}