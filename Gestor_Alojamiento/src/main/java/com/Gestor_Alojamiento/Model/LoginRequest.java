package com.Gestor_Alojamiento.Model;

public class LoginRequest {
    private String usuario;
    private String contrasenya;

  
    public LoginRequest() {}

    public LoginRequest(String usuario, String contrasenya) {
        this.usuario = usuario;
        
        this.contrasenya = contrasenya;
    }

    public String getUsuario() {
        return usuario;
    }

    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }

    public String getContrasenya() {
        return contrasenya;
    }

    public void setContrasenya(String contrasenya) {
        this.contrasenya = contrasenya;
    }
}