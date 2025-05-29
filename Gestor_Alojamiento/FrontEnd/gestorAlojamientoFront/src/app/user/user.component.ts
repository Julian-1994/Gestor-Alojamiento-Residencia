import { Component, OnInit } from '@angular/core';
import { AdminService } from '../admin/admin.service';
import { Reserva } from '../model/reserva.model';
import { Persona } from '../model/persona.model';
import { Habitacion } from '../model/habitacion.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaDTO } from '../model/ReservaDTO.model';
import { HabitacionDTO } from '../model/HabitacionDTO.model';
import { Establecimiento } from '../model/establecimiento.model';
import { EstablecimientoDTO } from '../model/EstablecimientoDTO.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UserComponent implements OnInit {

  reservas: ReservaDTO[] = [];
  personas: Persona[] = [];
  habitaciones: HabitacionDTO[] = [];
  establecimientos: EstablecimientoDTO[] = [];
  fechaDisponibilidadInicio: string = '';
  fechaDisponibilidadFin: string = '';
  habitacionesDisponibilidad: HabitacionDTO[] = [];
  reservasFiltradas: ReservaDTO[] = [];
  filtroReservas = { nombre: '', dni: '' };
  buscandoReservas = false;
  editandoEntidad: ReservaDTO | null = null;
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
        this.habitaciones = data; },
      error: (err) => { console.error('Error al cargar habitaciones:', err); }
    });
    this.adminService.getEstablecimientos().subscribe({
     next: (data) => { this.establecimientos = data; },
      error: (err) => { console.error('Error al cargar establecimientos:', err); }
});
  }

  aplicarFiltroReservas() {
    const { nombre, dni } = this.filtroReservas;
    this.reservasFiltradas = this.reservas.filter(r =>
      (!dni || r.personaDni.toLowerCase().includes(dni.toLowerCase()))
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
      const reservasDeHabitacion = this.reservas.filter(r => r.habitacionId === h.id);
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
      personaDni: this.personas.length > 0 ? this.personas[0].dni : '',
    establecimientoId: this.habitaciones.length > 0 ? this.habitaciones[0].establecimientoId : 0,
    habitacionId: this.habitaciones.length > 0 ? this.habitaciones[0].id : 0,
    
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

  reservarHabitacion(habitacion: HabitacionDTO) {
    const nuevaReserva: ReservaDTO = {
     personaDni: this.personas.length > 0 ? this.personas[0].dni : '',
    establecimientoId: habitacion.establecimientoId,
    habitacionId: habitacion.id,
    fechaEntrada: this.fechaDisponibilidadInicio,
    fechaSalida: this.fechaDisponibilidadFin,
    motivoEntrada: '',
    observaciones: ''
    };
    this.adminService.addReserva([nuevaReserva]).subscribe({
      next: () => { alert('Reserva creada exitosamente'); this.cargarDatos(); this.cerrarCalendario(); },
      error: (err) => { console.error('Error al reservar habitación:', err); }
    });
  }

  guardar() {
    if (this.esNuevo && this.editandoEntidad) {
      this.adminService.addReserva([this.editandoEntidad]).subscribe({
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