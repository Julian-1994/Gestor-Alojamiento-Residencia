package com.Gestor_Alojamiento.Batch;
import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.ReservaRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;



public class ReservaItemWriter implements ItemWriter<Reserva> {

    @Autowired
    private ReservaRepository reservaRepository;

       public ReservaItemWriter(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    @Override
    public void write(@NonNull Chunk<? extends Reserva> chunk) throws Exception {
         reservaRepository.deleteAll(chunk.getItems());
        System.out.println("Reservas eliminadas: " + chunk.getItems().size());
    }
}