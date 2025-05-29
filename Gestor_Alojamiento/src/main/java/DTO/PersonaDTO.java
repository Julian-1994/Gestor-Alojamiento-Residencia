package DTO;

import java.sql.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PersonaDTO {
 // Aunque no se usa en requests, es útil para respuestas
    private String dni;
    private String nombre;
    private String apellidos;
    private Date fechaNacimiento;
    private String telefono;
    private String email;

      /** Solo para serializar en respuestas, nunca en requests */
    @JsonProperty(access = JsonProperty.Access.READ_ONLY)
    private List<Integer> reservaIds;

    public PersonaDTO() {}

    public PersonaDTO(String dni,
                      String nombre,
                      String apellidos,
                      Date fechaNacimiento,
                      String telefono,
                      String email,
                      List<Integer> reservaIds) {
        this.dni             = dni;
        this.nombre          = nombre;
        this.apellidos       = apellidos;
        this.fechaNacimiento = fechaNacimiento;
        this.telefono        = telefono;
        this.email           = email;
        this.reservaIds      = reservaIds;
    }
    // Getters y setters


    public String getDni() { return dni; }
    public void setDni(String dni) { this.dni = dni; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellidos() { return apellidos; }
    public void setApellidos(String apellidos) { this.apellidos = apellidos; }

    public Date getFechaNacimiento() { return fechaNacimiento; }
    public void setFechaNacimiento(Date fechaNacimiento) { this.fechaNacimiento = fechaNacimiento; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public List<Integer> getReservaIds() {
        return reservaIds;
    }
    public void setReservaIds(List<Integer> reservaIds) {
        this.reservaIds = reservaIds;
    }
}

