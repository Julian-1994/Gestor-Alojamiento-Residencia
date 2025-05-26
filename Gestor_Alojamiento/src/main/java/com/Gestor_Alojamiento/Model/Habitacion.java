package com.Gestor_Alojamiento.Model;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import java.util.List;
import java.util.Objects;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;

@JsonIdentityInfo(
  generator = ObjectIdGenerators.PropertyGenerator.class,
  property = "id")
  @Entity
  
public class Habitacion {

	  @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private int id;

	    @Column(nullable = false)
	    private String numero;
	    @Column(nullable = false)
	    private String tipo;
	    
	    @Enumerated(EnumType.STRING)
	    @Column(nullable = false)
	    private EstadoHabitacion estado;

	    @ManyToOne 
	    @JsonIgnoreProperties("habitaciones")
	    private Establecimiento establecimiento;
	    
	@JsonIgnoreProperties("establecimiento")
	    @OneToMany(mappedBy = "habitacion")
	    private List<Reserva> reservas;

		public Habitacion() {
			super();
		}

		public Habitacion(int id, String numero, String tipo, EstadoHabitacion estado, Establecimiento establecimiento) {
			super();
			this.id = id;
			this.numero = numero;
			this.tipo = tipo;
			this.estado = estado;
			this.establecimiento = establecimiento;
		}

		public int getId() {
			return id;
		}

		public void setId(int id) {
			this.id = id;
		}

		public String getNumero() {
			return numero;
		}

		public void setNumero(String numero) {
			this.numero = numero;
		}

		public String getTipo() {
			return tipo;
		}

		public void setTipo(String tipo) {
			this.tipo = tipo;
		}

		public EstadoHabitacion getEstado() {
			return estado;
		}

		public void setEstado(EstadoHabitacion estado) {
			this.estado = estado;
		}

		public Establecimiento getEstablecimiento() {
			return establecimiento;
		}

		public void setEstablecimiento(Establecimiento establecimiento) {
			this.establecimiento = establecimiento;
		}

		@Override
		public String toString() {
			return "Habitacion [id=" + id + ", numero=" + numero + ", tipo=" + tipo + ", estado=" + estado
					+ ", establecimiento=" + establecimiento + "]";
		}

		@Override
		public int hashCode() {
			return Objects.hash(establecimiento, estado, id, numero, tipo);
		}

		@Override
		public boolean equals(Object obj) {
			if (this == obj)
				return true;
			if (obj == null)
				return false;
			if (getClass() != obj.getClass())
				return false;
			Habitacion other = (Habitacion) obj;
			return Objects.equals(establecimiento, other.establecimiento) && Objects.equals(estado, other.estado)
					&& id == other.id && Objects.equals(numero, other.numero) && Objects.equals(tipo, other.tipo);
		}

	
}
