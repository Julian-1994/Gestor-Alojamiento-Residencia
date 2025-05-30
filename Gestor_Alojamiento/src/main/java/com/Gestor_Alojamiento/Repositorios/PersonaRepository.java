package com.Gestor_Alojamiento.Repositorios;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.Gestor_Alojamiento.Model.Persona;


public interface PersonaRepository extends JpaRepository<Persona, String> {

        void deleteByDniIn(List<String> dnis);

        @Query("SELECT DATE(p.fechaNacimiento), COUNT(p) FROM Persona p GROUP BY DATE(p.fechaNacimiento)")
        List<Object[]> countAltasPorDia();

}
