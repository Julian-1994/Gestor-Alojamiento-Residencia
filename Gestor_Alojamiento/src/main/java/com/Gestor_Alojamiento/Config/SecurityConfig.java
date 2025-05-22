package com.Gestor_Alojamiento.Config;

import java.util.List;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.Gestor_Alojamiento.Model.Usuario;
import com.Gestor_Alojamiento.Repositorios.UsuarioRepository;
import org.springframework.security.core.userdetails.UsernameNotFoundException;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
        .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable()) // Deshabilitar CSRF para simplificar pruebas iniciales
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/usuarios/login").permitAll() // Permitir acceso al login
                        .requestMatchers("/api/usuarios/**").hasAnyRole("ADMIN", "USUARIO")
                        .requestMatchers("/api/personas/**").hasAnyRole("ADMIN", "USUARIO")
                        .requestMatchers("/api/reservas/**").hasAnyRole("ADMIN", "USUARIO")
                        .anyRequest().permitAll())
                    .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.IF_REQUIRED));
        return http.build();
    }

    @Bean
    public CommandLineRunner encryptPasswordsIfNeeded(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        return args -> {
            List<Usuario> usuarios = usuarioRepository.findAll();
            for (Usuario usuario : usuarios) {
                String password = usuario.getContrasenya();
                if (password == null || password.isEmpty()) continue;
                if (!password.startsWith("$2a$")) {
                    String encodedPassword = passwordEncoder.encode(password);
                    usuario.setContrasenya(encodedPassword);
                    usuarioRepository.save(usuario);
                    System.out.println("Contraseña cifrada para usuario: " + usuario.getNombreUsuario());
                }
            }
        };
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public UserDetailsService userDetailsService(UsuarioRepository usuarioRepository) {
        return username -> {
            Usuario user = usuarioRepository.findByNombreUsuario(username)
                .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado"));

            return User.builder()
                .username(user.getNombreUsuario())
                .password(user.getContrasenya())
                .roles(user.getRol())
                .build();
        };
    }
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:4200"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}