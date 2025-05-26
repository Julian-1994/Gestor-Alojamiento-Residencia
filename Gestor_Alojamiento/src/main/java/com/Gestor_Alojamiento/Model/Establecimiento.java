package com.Gestor_Alojamiento.Model;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Column;
import jakarta.persistence.OneToMany;
import java.util.List;
import java.util.Objects;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator.class,
  property = "id")

  @Entity
public class Establecimiento {

	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;

	    @Column(nullable = false)
	    private String nombre;
	    private String direccion;
	    private String telefono;
	    private int capacidad;
	    
	     @JsonIgnore
	    @OneToMany(mappedBy = "establecimiento")
	    private List<Habitacion> habitaciones;

	    @JsonIgnore
	    @OneToMany(mappedBy = "establecimiento")
	    private List<Reserva> reservas;

		public Establecimiento() {
			super();
		
		}

		public Establecimiento(int id, String nombre, String direccion, String telefono, int capacidad,
				List<Habitacion> habitaciones, List<Reserva> reservas) {
			super();
			this.id = id;
			this.nombre = nombre;
			this.direccion = direccion;
			this.telefono = telefono;
			this.capacidad = capacidad;
			this.habitaciones = habitaciones;
			this.reservas = reservas;
		}

		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public String getNombre() {
			return nombre;
		}

		public void setNombre(String nombre) {
			this.nombre = nombre;
		}

		public String getDireccion() {
			return direccion;
		}

		public void setDireccion(String direccion) {
			this.direccion = direccion;
		}

		public String getTelefono() {
			return telefono;
		}

		public void setTelefono(String telefono) {
			this.telefono = telefono;
		}

		public int getCapacidad() {
			return capacidad;
		}

		public void setCapacidad(int capacidad) {
			this.capacidad = capacidad;
		}

		public List<Habitacion> getHabitaciones() {
			return habitaciones;
		}

		public void setHabitaciones(List<Habitacion> habitaciones) {
			this.habitaciones = habitaciones;
		}

		public List<Reserva> getReservas() {
			return reservas;
		}

		public void setReservas(List<Reserva> reservas) {
			this.reservas = reservas;
		}

		@Override
		public String toString() {
			return "Establecimiento [id=" + id + ", nombre=" + nombre + ", direccion=" + direccion + ", telefono="
					+ telefono + ", capacidad=" + capacidad + ", habitaciones=" + habitaciones + ", reservas="
					+ reservas + "]";
		}

		@Override
		public int hashCode() {
			return Objects.hash(capacidad, direccion, habitaciones, id, nombre, reservas, telefono);
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			Establecimiento other = (Establecimiento) obj;
			return capacidad == other.capacidad && Objects.equals(direccion, other.direccion)
					&& Objects.equals(habitaciones, other.habitaciones) && id == other.id
					&& Objects.equals(nombre, other.nombre) && Objects.equals(reservas, other.reservas)
					&& Objects.equals(telefono, other.telefono);
		}
	    
	    
}
