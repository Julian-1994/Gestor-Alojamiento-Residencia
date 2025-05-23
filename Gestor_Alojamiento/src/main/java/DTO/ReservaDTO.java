package DTO;

import java.time.LocalDateTime;

public class ReservaDTO {
     private int id;

    // Información simplificada de Persona (podría ser solo id o id + nombre)
    private String personaDni;
    private String personaNombre; // opcional, si quieres

    // Información simplificada de Establecimiento
    private int establecimientoId;
    private String establecimientoNombre; // opcional

    // Información simplificada de Habitacion
    private int habitacionId;
    private String habitacionNumero; // opcional

    private LocalDateTime fechaEntrada;
    private LocalDateTime fechaSalida;
    private String motivoEntrada;
    private String observaciones;

    public ReservaDTO() {}

    public ReservaDTO(int id, String personaDni, String personaNombre, int establecimientoId, String establecimientoNombre,
                      int habitacionId, String habitacionNumero, LocalDateTime fechaEntrada, LocalDateTime fechaSalida,
                      String motivoEntrada, String observaciones) {
        this.id = id;
        this.personaDni = personaDni;
        this.personaNombre = personaNombre;
        this.establecimientoId = establecimientoId;
        this.establecimientoNombre = establecimientoNombre;
        this.habitacionId = habitacionId;
        this.habitacionNumero = habitacionNumero;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
        this.motivoEntrada = motivoEntrada;
        this.observaciones = observaciones;
    }

    // Getters y setters

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getPersonaDni() { return personaDni; }
    public void setPersonaDni(String personaDni) { this.personaDni = personaDni; }

    public String getPersonaNombre() { return personaNombre; }
    public void setPersonaNombre(String personaNombre) { this.personaNombre = personaNombre; }

    public int getEstablecimientoId() { return establecimientoId; }
    public void setEstablecimientoId(int establecimientoId) { this.establecimientoId = establecimientoId; }

    public String getEstablecimientoNombre() { return establecimientoNombre; }
    public void setEstablecimientoNombre(String establecimientoNombre) { this.establecimientoNombre = establecimientoNombre; }

    public int getHabitacionId() { return habitacionId; }
    public void setHabitacionId(int habitacionId) { this.habitacionId = habitacionId; }

    public String getHabitacionNumero() { return habitacionNumero; }
    public void setHabitacionNumero(String habitacionNumero) { this.habitacionNumero = habitacionNumero; }

    public LocalDateTime getFechaEntrada() { return fechaEntrada; }
    public void setFechaEntrada(LocalDateTime fechaEntrada) { this.fechaEntrada = fechaEntrada; }

    public LocalDateTime getFechaSalida() { return fechaSalida; }
    public void setFechaSalida(LocalDateTime fechaSalida) { this.fechaSalida = fechaSalida; }

    public String getMotivoEntrada() { return motivoEntrada; }
    public void setMotivoEntrada(String motivoEntrada) { this.motivoEntrada = motivoEntrada; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}

