import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { Reserva } from '../model/reserva.model';
import { Persona } from '../model/persona.model';
import { Habitacion } from '../model/habitacion.model';
import { Establecimiento } from '../model/establecimiento.model';
import { Usuario } from '../model/usuario.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AdminComponent implements OnInit {

  reservas: Reserva[] = [];
  personas: Persona[] = [];
  habitaciones: Habitacion[] = [];
  establecimientos: Establecimiento[] = [];
  usuarios: Usuario[] = [];

  // Control de visibilidad para tablas
  mostrarReservas = false;
  mostrarPersonas = false;
  mostrarHabitaciones = false;
  mostrarEstablecimientos = false;
  mostrarUsuarios = false;

  // Variables para formularios de edición/añadir
  editandoEntidad: any = null;   // objeto actual para editar
  entidadTipo: string = '';      // reserva, persona, habitacion, etc.
  esNuevo: boolean = false;      // si es añadir o editar

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.adminService.getReservas().subscribe({
      next: (data) => { this.reservas = data; },
      error: (err) => { console.error('Error al cargar reservas:', err); }
    });
    this.adminService.getPersonas().subscribe({
      next: (data) => { this.personas = data; },
      error: (err) => { console.error('Error al cargar personas:', err); }
    });
    this.adminService.getHabitaciones().subscribe({
      next: (data) => { this.habitaciones = data; },
      error: (err) => { console.error('Error al cargar habitaciones:', err); }
    });
    this.adminService.getEstablecimientos().subscribe({
      next: (data) => { this.establecimientos = data; },
      error: (err) => { console.error('Error al cargar establecimientos:', err); }
    });
    this.adminService.getUsuarios().subscribe({
      next: (data) => { this.usuarios = data; },
      error: (err) => { console.error('Error al cargar usuarios:', err); }
    });
  }

  // Toggle para mostrar/ocultar tabla
  mostrarEntidad(nombre: string) {
    this.mostrarReservas = false;
    this.mostrarPersonas = false;
    this.mostrarHabitaciones = false;
    this.mostrarEstablecimientos = false;
    this.mostrarUsuarios = false;
    switch(nombre) {
      case 'reservas': this.mostrarReservas = !this.mostrarReservas; break;
      case 'personas': this.mostrarPersonas = !this.mostrarPersonas; break;
      case 'habitaciones': this.mostrarHabitaciones = !this.mostrarHabitaciones; break;
      case 'establecimientos': this.mostrarEstablecimientos = !this.mostrarEstablecimientos; break;
      case 'usuarios': this.mostrarUsuarios = !this.mostrarUsuarios; break;
    }
  }

  // Abrir formulario para añadir
  abrirNuevo(tipo: string) {
    this.entidadTipo = tipo;
    this.esNuevo = true;
    this.editandoEntidad = {}; // objeto vacío para rellenar
  }

  // Abrir formulario para editar
  abrirEditar(tipo: string, entidad: any) {
    this.entidadTipo = tipo;
    this.esNuevo = false;
    this.editandoEntidad = { ...entidad }; // clonar objeto para no editar original directo
  }

  // Guardar cambios (añadir o editar)
  guardar() {
    if (this.esNuevo) {
      this.agregarEntidad();
    } else {
      this.actualizarEntidad();
    }
  }

  // Añadir entidad usando AdminService
  agregarEntidad() {
    switch(this.entidadTipo) {
      case 'reservas':
        this.adminService.addReserva(this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
      case 'personas':
        this.adminService.addPersona(this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
      case 'habitaciones':
        this.adminService.addHabitacion(this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
      case 'establecimientos':
        this.adminService.addEstablecimiento(this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
      case 'usuarios':
        this.adminService.addUsuario(this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
    }
  }

  // Actualizar entidad
  actualizarEntidad() {
    switch(this.entidadTipo) {
      case 'reservas':
        this.adminService.updateReserva(this.editandoEntidad.id, this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
      case 'personas':
        this.adminService.updatePersona(this.editandoEntidad.dni, this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
      case 'habitaciones':
        this.adminService.updateHabitacion(this.editandoEntidad.id, this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
      case 'establecimientos':
        this.adminService.updateEstablecimiento(this.editandoEntidad.id, this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
      case 'usuarios':
        this.adminService.updateUsuario(this.editandoEntidad.id, this.editandoEntidad).subscribe(() => this.postOperacion());
        break;
    }
  }

  // Eliminar entidad
  eliminarEntidad(tipo: string, entidad: any) {
    if(!confirm('¿Seguro que deseas eliminar este elemento?')) return;
    switch(tipo) {
      case 'reservas':
        this.adminService.deleteReserva(entidad.id).subscribe(() => this.postOperacion());
        break;
      case 'personas':
        this.adminService.deletePersona(entidad.dni).subscribe(() => this.postOperacion());
        break;
      case 'habitaciones':
        this.adminService.deleteHabitacion(entidad.id).subscribe(() => this.postOperacion());
        break;
      case 'establecimientos':
        this.adminService.deleteEstablecimiento(entidad.id).subscribe(() => this.postOperacion());
        break;
      case 'usuarios':
        this.adminService.deleteUsuario(entidad.id).subscribe(() => this.postOperacion());
        break;
    }
  }

  // Refrescar datos y cerrar formulario
  postOperacion() {
    this.cargarDatos();
    this.editandoEntidad = null;
    this.entidadTipo = '';
    this.esNuevo = false;
  }

  // Cancelar edición/añadir
  cancelar() {
    this.editandoEntidad = null;
    this.entidadTipo = '';
    this.esNuevo = false;
  }
}