package com.Gestor_Alojamiento.Repositorios;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.Gestor_Alojamiento.Model.Persona;


public interface PersonaRepository extends JpaRepository<Persona, String> {

        void deleteByDniIn(List<String> dnis);

}
