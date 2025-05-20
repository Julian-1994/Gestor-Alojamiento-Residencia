package com.Gestor_Alojamiento.Servicios;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.Gestor_Alojamiento.Model.Establecimiento;
import com.Gestor_Alojamiento.Repositorios.EstablecimientoRepository;


@Service
public class EstablecimientoServicio {

	@Autowired
    private EstablecimientoRepository establecimientoRepository;

    public List<Establecimiento> findAll() {
        return establecimientoRepository.findAll();
    }

    public Establecimiento findById(int id) {
        return establecimientoRepository.findById(id).orElse(null);
    }

    public Establecimiento save(Establecimiento establecimiento) {
        return establecimientoRepository.save(establecimiento);
    }

    public void deleteById(int id) {
        establecimientoRepository.deleteById(id);
    }

	public boolean existsById(int id) {
	    return establecimientoRepository.existsById(id);
	}
}
