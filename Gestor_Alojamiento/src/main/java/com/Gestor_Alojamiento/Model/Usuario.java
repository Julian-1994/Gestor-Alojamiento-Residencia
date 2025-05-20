package com.Gestor_Alojamiento.Model;

import java.util.Objects;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Usuario {

	 @Id
	    @GeneratedValue(strategy = GenerationType.AUTO)
	    private int id;

	    @Column(nullable = false, unique = true)
	    private String nombreUsuario;
	    private String contrasenya;
	    private String rol;
		private String email;
	    public Usuario() {
			super();
		
		}

		public Usuario(int id, String nombreUsuario, String contraseña, String rol) {
			super();
			this.id = id;
			this.nombreUsuario = nombreUsuario;
			this.contrasenya = contraseña;
			this.rol = rol;
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

		@Override
		public String toString() {
			return "Usuario [id=" + id + ", nombreUsuario=" + nombreUsuario + ", contraseña=" + contrasenya + ", rol="
					+ rol + "]";
		}

		@Override
		public int hashCode() {
			return Objects.hash(contrasenya, id, nombreUsuario, rol);
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			Usuario other = (Usuario) obj;
			return Objects.equals(contrasenya, other.contrasenya) && id == other.id
					&& Objects.equals(nombreUsuario, other.nombreUsuario) && Objects.equals(rol, other.rol);
		}

		public String getEmail() {
			return email;
		}

		public void setEmail(String email) {
			this.email = email;
		}

	    
	
}
