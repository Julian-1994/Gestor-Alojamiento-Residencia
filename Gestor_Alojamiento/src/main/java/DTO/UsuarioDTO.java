package DTO;

public class UsuarioDTO {
    
    private int id;
    private String nombreUsuario;
    private String contrasenya;
    private String rol;
    private String email;

    public UsuarioDTO() {}

    public UsuarioDTO(int id, String nombreUsuario, String contrasenya, String rol, String email) {
        this.id = id;
        this.nombreUsuario = nombreUsuario;
        this.contrasenya = contrasenya;
        this.rol = rol;
        this.email = email;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getNombreUsuario() {
        return nombreUsuario;
    }

    public void setNombreUsuario(String nombreUsuario) {
        this.nombreUsuario = nombreUsuario;
    }

    public String getContrasenya() {
        return contrasenya;
    }

    public void setContrasenya(String contrasenya) {
        this.contrasenya = contrasenya;
    }

    public String getRol() {
        return rol;
    }

    public void setRol(String rol) {
        this.rol = rol;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}

