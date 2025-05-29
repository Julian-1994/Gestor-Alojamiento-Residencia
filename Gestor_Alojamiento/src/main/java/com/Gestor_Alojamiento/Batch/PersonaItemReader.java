package com.Gestor_Alojamiento.Batch;

import com.Gestor_Alojamiento.Model.Persona;
import com.Gestor_Alojamiento.Model.Reserva;
import com.Gestor_Alojamiento.Repositorios.PersonaRepository;
import com.Gestor_Alojamiento.Repositorios.ReservaRepository;
import org.springframework.batch.item.ItemReader;

import java.util.*;

public class PersonaItemReader implements ItemReader<Persona> {

    private final PersonaRepository personaRepository;
    private final ReservaRepository reservaRepository;
    private Iterator<Persona> iterator;

    // Constructor necesario para el bean
    public PersonaItemReader(PersonaRepository personaRepository, ReservaRepository reservaRepository) {
        this.personaRepository = personaRepository;
        this.reservaRepository = reservaRepository;
    }

    @Override
    public Persona read() {
        if (iterator == null) {
            Calendar cal = Calendar.getInstance();
            cal.add(Calendar.YEAR, -5);
            Date haceCincoAnios = cal.getTime();

            List<Persona> personas = personaRepository.findAll();
            List<Persona> personasParaBorrar = new ArrayList<>();

          for (Persona persona : personas) {
    List<Reserva> reservas = reservaRepository.findByPersonaDni(persona.getDni());
    if (reservas.isEmpty()) {
        // Si no tiene reservas, se puede borrar
        personasParaBorrar.add(persona);
    } else {
        Date ultimaSalida = reservas.stream()
                .map(Reserva::getFechaSalida)
                .max(Date::compareTo)
                .orElse(null);
        if (ultimaSalida != null && ultimaSalida.before(haceCincoAnios)) {
            personasParaBorrar.add(persona);
        }
    }
}
            iterator = personasParaBorrar.iterator();
        }
        return (iterator != null && iterator.hasNext()) ? iterator.next() : null;
    }
}