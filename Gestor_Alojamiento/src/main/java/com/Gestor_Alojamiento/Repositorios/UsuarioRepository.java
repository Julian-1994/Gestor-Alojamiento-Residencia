package com.Gestor_Alojamiento.Repositorios;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import com.Gestor_Alojamiento.Model.Usuario;


public interface UsuarioRepository extends JpaRepository<Usuario, Integer> {
	
	Optional<Usuario> findByNombreUsuario(String nombreUsuario);
	
	Usuario findByEmail(String email);

	Usuario findByNombreUsuarioAndContrasenya(String nombreUsuario, String contrasenya);


}
