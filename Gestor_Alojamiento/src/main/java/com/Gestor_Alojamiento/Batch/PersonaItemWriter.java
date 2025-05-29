package com.Gestor_Alojamiento.Batch;

import com.Gestor_Alojamiento.Model.Persona;
import com.Gestor_Alojamiento.Repositorios.PersonaRepository;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.batch.item.Chunk;



public class PersonaItemWriter implements ItemWriter<Persona> {

    @Autowired
    private PersonaRepository personaRepository;

    @Override
    public void write(@NonNull Chunk<? extends Persona> chunk) throws Exception {
        personaRepository.deleteAll(chunk.getItems());
        System.out.println("Personas eliminadas: " + chunk.getItems().size());
    }
}