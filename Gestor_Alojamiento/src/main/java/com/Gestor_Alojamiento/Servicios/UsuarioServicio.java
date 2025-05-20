package com.Gestor_Alojamiento.Servicios;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.Gestor_Alojamiento.Model.Usuario;
import com.Gestor_Alojamiento.Repositorios.UsuarioRepository;

@Service
public class UsuarioServicio {

	@Autowired
    private UsuarioRepository usuarioRepository;
	
	@Autowired
	 private PasswordEncoder passwordEncoder;

    public List<Usuario> findAll() {
        return usuarioRepository.findAll();
    }

    public Usuario findById(int id) {
        return usuarioRepository.findById(id).orElse(null);
    }

    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email);
        }
    
    public Optional<Usuario> findByNombreUsuario(String nombreUsuario) {
		return usuarioRepository.findByNombreUsuario(nombreUsuario);
	}
    
    public Usuario save(Usuario usuario) {
        usuario.setContrasenya(passwordEncoder.encode(usuario.getContrasenya()));
        return usuarioRepository.save(usuario);
    }

    public void deleteById(int id) {
        usuarioRepository.deleteById(id);
    }

	public boolean existsById(int id) {
		return usuarioRepository.existsById(id);
	}
	
	// Método para autenticar usuario
    public boolean authenticate(String email, String rawPassword) {
        Usuario usuario = findByEmail(email);
        if (usuario != null) {
            return passwordEncoder.matches(rawPassword, usuario.getContrasenya());
        }
        return false;
    }
}
