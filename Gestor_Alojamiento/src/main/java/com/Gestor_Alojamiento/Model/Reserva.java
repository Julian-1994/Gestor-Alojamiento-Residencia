package com.Gestor_Alojamiento.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.ManyToOne;

import java.time.LocalDateTime;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;

@Entity
public class Reserva {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private int id;

    @ManyToOne
    @JsonManagedReference
    @JoinColumn(name = "persona_dni", nullable = false)
    private Persona persona;

    @ManyToOne
    @JsonIgnoreProperties("reservas")
    @JoinColumn(name = "establecimiento_id", nullable = false)
    private Establecimiento establecimiento;

    @ManyToOne
    @JsonIgnoreProperties("reservas")
    @JoinColumn(name = "habitacion_id", nullable = false)
    private Habitacion habitacion;

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaEntrada;

    @Column(nullable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime fechaSalida;

    private String motivoEntrada;
    private String observaciones;

    public Reserva() {
        super();
    }

    public Reserva(int id, Persona persona, Establecimiento establecimiento, Habitacion habitacion,
                   LocalDateTime fechaEntrada, LocalDateTime fechaSalida, String motivoEntrada, String observaciones) {
        super();
        this.id = id;
        this.persona = persona;
        this.establecimiento = establecimiento;
        this.habitacion = habitacion;
        this.fechaEntrada = fechaEntrada;
        this.fechaSalida = fechaSalida;
        this.motivoEntrada = motivoEntrada;
        this.observaciones = observaciones;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public Persona getPersona() {
        return persona;
    }

    public void setPersona(Persona persona) {
        this.persona = persona;
    }

    public Establecimiento getEstablecimiento() {
        return establecimiento;
    }

    public void setEstablecimiento(Establecimiento establecimiento) {
        this.establecimiento = establecimiento;
    }

    public Habitacion getHabitacion() {
        return habitacion;
    }

    public void setHabitacion(Habitacion habitacion) {
        this.habitacion = habitacion;
    }

    public LocalDateTime getFechaEntrada() {
        return fechaEntrada;
    }

    public void setFechaEntrada(LocalDateTime fechaEntrada) {
        this.fechaEntrada = fechaEntrada;
    }

    public LocalDateTime getFechaSalida() {
        return fechaSalida;
    }

    public void setFechaSalida(LocalDateTime fechaSalida) {
        this.fechaSalida = fechaSalida;
    }

    public String getMotivoEntrada() {
        return motivoEntrada;
    }

    public void setMotivoEntrada(String motivoEntrada) {
        this.motivoEntrada = motivoEntrada;
    }

    public String getObservaciones() {
        return observaciones;
    }

    public void setObservaciones(String observaciones) {
        this.observaciones = observaciones;
    }

    @Override
    public String toString() {
        return "Reserva [id=" + id + ", persona=" + persona + ", establecimiento=" + establecimiento
                + ", habitacion=" + habitacion + ", fechaEntrada=" + fechaEntrada + ", fechaSalida=" + fechaSalida
                + ", motivoEntrada=" + motivoEntrada + ", observaciones=" + observaciones + "]";
    }

    @Override
    public int hashCode() {
        return Objects.hash(establecimiento, fechaEntrada, fechaSalida, habitacion, id, motivoEntrada,
                observaciones, persona);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj)
            return true;
        if (obj == null)
            return false;
        if (getClass() != obj.getClass())
            return false;
        Reserva other = (Reserva) obj;
        return Objects.equals(establecimiento, other.establecimiento)
                && Objects.equals(fechaEntrada, other.fechaEntrada)
                && Objects.equals(fechaSalida, other.fechaSalida) && Objects.equals(habitacion, other.habitacion)
                && id == other.id && Objects.equals(motivoEntrada, other.motivoEntrada)
                && Objects.equals(observaciones, other.observaciones) && Objects.equals(persona, other.persona);
    }
}
