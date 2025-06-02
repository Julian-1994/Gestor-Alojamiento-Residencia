package DTO;

import com.Gestor_Alojamiento.Model.EstadoHabitacion;

public class HabitacionDTO {
    private int id;
    private String numero;
    private String tipo;
    private EstadoHabitacion estado; 
    private int establecimientoId;
   

    public HabitacionDTO() {}

    public HabitacionDTO(int id, String numero, String tipo, EstadoHabitacion estado, int establecimientoId) {
        this.id = id;
        this.numero = numero;
        this.tipo = tipo;
        this.estado = estado;
        this.establecimientoId = establecimientoId;
   
    }

    // Getters y setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public EstadoHabitacion getEstado() { return estado; }
    public void setEstado(EstadoHabitacion estado) { this.estado = estado; }

    public int getEstablecimientoId() { return establecimientoId; }
    public void setEstablecimientoId(int establecimientoId) { this.establecimientoId = establecimientoId; }
 }
