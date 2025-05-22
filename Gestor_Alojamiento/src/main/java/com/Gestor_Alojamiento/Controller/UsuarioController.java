package com.Gestor_Alojamiento.Controller;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.web.bind.annotation.*;
import com.Gestor_Alojamiento.Model.LoginRequest;
import com.Gestor_Alojamiento.Model.Usuario;
import com.Gestor_Alojamiento.Repositorios.UsuarioRepository;
import com.Gestor_Alojamiento.Servicios.UsuarioServicio;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequestMapping("/api/usuarios") // Ruta base para el controlador
public class UsuarioController {

    @Autowired
    private UsuarioServicio usuarioServicio;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<Usuario> getAllUsuarios() {
        return usuarioServicio.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Usuario> getUsuarioById(@PathVariable int id) {
        Usuario usuario = usuarioServicio.findById(id);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/email/{email}")
    public ResponseEntity<Usuario> getUsuarioByEmail(@PathVariable String email) {
        Usuario usuario = usuarioServicio.findByEmail(email);
        if (usuario == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(usuario);
    }

    @PostMapping (consumes = "application/json")
    public ResponseEntity<Usuario> createUsuario(@RequestBody Usuario usuario) {
        Usuario nuevoUsuario = usuarioServicio.save(usuario);
        return ResponseEntity.ok(nuevoUsuario);
    }

    @PutMapping (value = "/{id}", consumes = "application/json")
    public ResponseEntity<Usuario> updateUsuario(@PathVariable int id, @RequestBody Usuario usuario) {
        if (!usuarioServicio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuario.setId(id);
        Usuario actualizadoUsuario = usuarioServicio.save(usuario);
        return ResponseEntity.ok(actualizadoUsuario);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUsuario(@PathVariable int id) {
        if (!usuarioServicio.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        usuarioServicio.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    // Autenticar usuario
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest , HttpServletRequest request) {
        String username = loginRequest.getUsuario();
        String password = loginRequest.getContrasenya();

        if (password == null || password.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("La contraseña no puede estar vacía");
        }

        Usuario usuario = usuarioRepository.findByNombreUsuario(username)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

        if (!passwordEncoder.matches(password, usuario.getContrasenya())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Contraseña incorrecta");
        }
        
     // 1) Creamos el token de autenticación con roles
        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + usuario.getRol()));
        var authToken   = new UsernamePasswordAuthenticationToken(username, null, authorities);

        // 2) Lo colocamos en el contexto de seguridad
        SecurityContextHolder.getContext().setAuthentication(authToken);

        // 3) Lo guardamos en la sesión HTTP
        request.getSession()
               .setAttribute(
                 HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY,
                 SecurityContextHolder.getContext()
               );


        return ResponseEntity.ok(usuario);
    }
}
