package DTO;

import java.sql.Date;

public class ReservaDTO {

    private int id;
    private String personaDni;
    private int establecimientoId;
    private int habitacionId;
    private Date fechaEntrada;
    private Date fechaSalida;
    private String motivoEntrada;
    private String observaciones;

    public ReservaDTO() {}

    public ReservaDTO( String personaDni,  int establecimientoId,
                      int habitacionId, String habitacionNumero, Date fechaEntrada, Date fechaSalida,
                      String motivoEntrada, String observaciones) {
       
        this.personaDni = personaDni;
        this.establecimientoId = establecimientoId;
        this.habitacionId = habitacionId;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
        this.motivoEntrada = motivoEntrada;
        this.observaciones = observaciones;
    }


    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getPersonaDni() { return personaDni; }
    public void setPersonaDni(String personaDni) { this.personaDni = personaDni; }


    public int getEstablecimientoId() { return establecimientoId; }
    public void setEstablecimientoId(int establecimientoId) { this.establecimientoId = establecimientoId; }

    public int getHabitacionId() { return habitacionId; }
    public void setHabitacionId(int habitacionId) { this.habitacionId = habitacionId; }

    public Date getFechaEntrada() { return fechaEntrada; }
    public void setFechaEntrada(Date fechaEntrada) { this.fechaEntrada = fechaEntrada; }

    public Date getFechaSalida() { return fechaSalida; }
    public void setFechaSalida(Date fechaSalida) { this.fechaSalida = fechaSalida; }

    public String getMotivoEntrada() { return motivoEntrada; }
    public void setMotivoEntrada(String motivoEntrada) { this.motivoEntrada = motivoEntrada; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }
}

