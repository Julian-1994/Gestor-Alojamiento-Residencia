package com.Gestor_Alojamiento.Model; // Cambia el paquete según tu estructura

public class AuthResponse {
    private String rol;

    public AuthResponse(String rol) {
        this.rol = rol;
    }

    // Getters y setters
    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }
}