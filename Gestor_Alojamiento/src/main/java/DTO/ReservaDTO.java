package DTO;

import java.time.LocalDateTime;


public class ReservaDTO {

    // Información simplificada de Persona (podría ser solo id o id + nombre)
    private String personaDni;

    // Información simplificada de Establecimiento
    private int establecimientoId;


    // Información simplificada de Habitacion
    private int habitacionId;

    private LocalDateTime fechaEntrada;
    private LocalDateTime fechaSalida;
    private String motivoEntrada;
    private String observaciones;

    public ReservaDTO() {}

    public ReservaDTO( String personaDni,  int establecimientoId,
                      int habitacionId, String habitacionNumero, LocalDateTime fechaEntrada, LocalDateTime fechaSalida,
                      String motivoEntrada, String observaciones) {
       
        this.personaDni = personaDni;
        this.establecimientoId = establecimientoId;
        this.habitacionId = habitacionId;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
        this.motivoEntrada = motivoEntrada;
        this.observaciones = observaciones;
    }

    // Getters y setters


    public String getPersonaDni() { return personaDni; }
    public void setPersonaDni(String personaDni) { this.personaDni = personaDni; }


    public int getEstablecimientoId() { return establecimientoId; }
    public void setEstablecimientoId(int establecimientoId) { this.establecimientoId = establecimientoId; }

    public int getHabitacionId() { return habitacionId; }
    public void setHabitacionId(int habitacionId) { this.habitacionId = habitacionId; }

    public LocalDateTime getFechaEntrada() { return fechaEntrada; }
    public void setFechaEntrada(LocalDateTime fechaEntrada) { this.fechaEntrada = fechaEntrada; }

    public LocalDateTime getFechaSalida() { return fechaSalida; }
    public void setFechaSalida(LocalDateTime fechaSalida) { this.fechaSalida = fechaSalida; }

    public String getMotivoEntrada() { return motivoEntrada; }
    public void setMotivoEntrada(String motivoEntrada) { this.motivoEntrada = motivoEntrada; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}

