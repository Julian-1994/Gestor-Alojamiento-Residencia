import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { Reserva } from '../model/reserva.model';
import { Persona } from '../model/persona.model';
import { Habitacion } from '../model/habitacion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UserComponent implements OnInit {

  reservas: Reserva[] = [];
  personas: Persona[] = [];
  habitaciones: Habitacion[] = [];
  establecimientos: any[] = [];
  fechaDisponibilidadInicio: string = '';
  fechaDisponibilidadFin: string = '';
  habitacionesDisponibilidad: Habitacion[] = [];
  reservasFiltradas: Reserva[] = [];
  filtroReservas = { nombre: '', dni: '' };
  buscandoReservas = false;
  editandoEntidad: Reserva | null = null;
  esNuevo: boolean = false;
  mostrarCalendario: boolean = false;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.adminService.getReservas().subscribe({
      next: (data) => { this.reservas = data; this.reservasFiltradas = data; },
      error: (err) => { console.error('Error al cargar reservas:', err); }
    });
    this.adminService.getPersonas().subscribe({
      next: (data) => { this.personas = data; },
      error: (err) => { console.error('Error al cargar personas:', err); }
    });
    this.adminService.getHabitaciones().subscribe({
      next: (data) => { 
        this.habitaciones = data; 
        this.establecimientos = [...new Set(data.map(h => h.establecimiento))]; // Obtener establecimientos únicos
      },
      error: (err) => { console.error('Error al cargar habitaciones:', err); }
    });
  }

  aplicarFiltroReservas() {
    const { nombre, dni } = this.filtroReservas;
    this.reservasFiltradas = this.reservas.filter(r =>
      (!nombre || r.persona?.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!dni || r.persona?.dni.toLowerCase().includes(dni.toLowerCase()))
    );
  }

  resetearFiltrosReservas() {
    this.filtroReservas = { nombre: '', dni: '' };
    this.reservasFiltradas = [...this.reservas];
  }

  verDisponibilidadHabitaciones() {
    const entrada = new Date(this.fechaDisponibilidadInicio);
    const salida = new Date(this.fechaDisponibilidadFin);

    this.habitacionesDisponibilidad = this.habitaciones.map(h => {
      const reservasDeHabitacion = this.reservas.filter(r => r.habitacion.id === h.id);
      const ocupada = reservasDeHabitacion.some(r => {
        const rEntrada = new Date(r.fechaEntrada);
        const rSalida = new Date(r.fechaSalida);
        return entrada < rSalida && salida > rEntrada;
      });

      return {
        ...h,
        estadoActual: ocupada ? 'Ocupada' : 'Disponible'
      };
    }).filter(h => h.estadoActual === 'Disponible');
  }

  abrirNuevo() {
    this.esNuevo = true;
    this.editandoEntidad = {
      id: 0,
      persona: this.personas[0], // Asignar la persona adecuada
      establecimiento: this.habitaciones[0].establecimiento,
      habitacion: this.habitaciones[0],
      fechaEntrada: '',
      fechaSalida: '',
      motivoEntrada: '',
      observaciones: ''
    };
  }

  abrirCalendario() {
    this.mostrarCalendario = true;
  }

  cerrarCalendario() {
    this.mostrarCalendario = false;
    this.fechaDisponibilidadInicio = '';
    this.fechaDisponibilidadFin = '';
    this.habitacionesDisponibilidad = [];
  }

  reservarHabitacion(habitacion: Habitacion) {
    const nuevaReserva: Reserva = {
      id: 0,
      persona: this.personas[0], // Aquí deberías obtener el DNI del usuario actual
      establecimiento: habitacion.establecimiento,
      habitacion: habitacion,
      fechaEntrada: this.fechaDisponibilidadInicio,
      fechaSalida: this.fechaDisponibilidadFin,
      motivoEntrada: '',
      observaciones: ''
    };
    this.adminService.addReserva(nuevaReserva).subscribe({
      next: () => { alert('Reserva creada exitosamente'); this.cargarDatos(); this.cerrarCalendario(); },
      error: (err) => { console.error('Error al reservar habitación:', err); }
    });
  }

  guardar() {
    if (this.esNuevo && this.editandoEntidad) {
      this.adminService.addReserva(this.editandoEntidad).subscribe({
        next: () => { alert('Reserva creada exitosamente'); this.cargarDatos(); },
        error: (err) => { console.error('Error al crear reserva:', err); }
      });
    }
    this.cancelar();
  }

  cancelar() {
    this.editandoEntidad = null;
    this.esNuevo = false;
  }

   abrirEditar(tipo: string, entidad: any) {
    this.esNuevo = false;
    this.editandoEntidad = { ...entidad }; // clonar objeto para no editar original directo
  }

  eliminarEntidad(tipo: string, entidad: any) {
    if (!confirm('¿Seguro que deseas eliminar este elemento?')) return;
    switch (tipo) {
      case 'reservas':
        this.adminService.deleteReserva(entidad.id).subscribe({
          next: () => { this.cargarDatos(); },
          error: (err) => { console.error('Error al eliminar reserva:', err); }
        });
        break;
      // Agrega casos para otros tipos de entidades si es necesario
    }
  }
}