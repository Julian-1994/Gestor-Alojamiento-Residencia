package com.Gestor_Alojamiento.DTO;

import java.util.List;

public class EstablecimientoDTO {
    private int id;
    private String nombre;
    private String direccion;
    private String telefono;
    private int capacidad;

    // IDs de habitaciones asociadas
    private List<Integer> habitacionIds;

    public EstablecimientoDTO() {}

    public EstablecimientoDTO(int id,
                              String nombre,
                              String direccion,
                              String telefono,
                              int capacidad,
                              List<Integer> habitacionIds) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.capacidad = capacidad;
        this.habitacionIds = habitacionIds;
    }

    // Getters y setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public int getCapacidad() { return capacidad; }
    public void setCapacidad(int capacidad) { this.capacidad = capacidad; }

    public List<Integer> getHabitacionIds() {
        return habitacionIds;
    }
    public void setHabitacionIds(List<Integer> habitacionIds) {
        this.habitacionIds = habitacionIds;
    }
}