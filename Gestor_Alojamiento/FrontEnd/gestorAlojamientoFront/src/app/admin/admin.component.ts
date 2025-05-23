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

  // Métodos fecha
  fechaDisponibilidadInicio: string = '';
  fechaDisponibilidadFin: string = '';
  habitacionesDisponibilidad: any[] = [];

  // Filtros y estados de búsqueda
  buscandoReservas = false;
  buscandoPersonas = false;
  buscandoHabitaciones = false;
  buscandoEstablecimientos = false;
  buscandoUsuarios = false;

  filtroReservas = { dni: '', establecimientoId: '', fechaDesde: '', fechaHasta: '' };
  filtroPersonas = { nombre: '', apellidos: '', dni: '' };
  filtroHabitaciones = { numero: '', tipo: '', estado: '', establecimientoId: '' };
  filtroEstablecimientos = { nombre: '', direccion: '', telefono: '', capacidad: '' };
  filtroUsuarios = { nombreUsuario: '', rol: '', email: '' };

  reservasFiltradas: Reserva[] = [];
  personasFiltradas: Persona[] = [];
  habitacionesFiltradas: Habitacion[] = [];
  establecimientosFiltrados: Establecimiento[] = [];
  usuariosFiltrados: Usuario[] = [];

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
      next: (data) => { this.personas = data; this.personasFiltradas = data; },
      error: (err) => { console.error('Error al cargar personas:', err); }
    });
    this.adminService.getHabitaciones().subscribe({
      next: (data) => { this.habitaciones = data; this.habitacionesFiltradas = data; },
      error: (err) => { console.error('Error al cargar habitaciones:', err); }
    });
    this.adminService.getEstablecimientos().subscribe({
      next: (data) => { this.establecimientos = data; this.establecimientosFiltrados = data; },
      error: (err) => { console.error('Error al cargar establecimientos:', err); }
    });
    this.adminService.getUsuarios().subscribe({
      next: (data) => { this.usuarios = data; this.usuariosFiltrados = data; },
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
    if (this.entidadTipo === 'reservas' || this.entidadTipo === 'habitaciones') {
    if (!this.editandoEntidad.establecimiento) {
      this.editandoEntidad.establecimiento = {};
    }
  }
}



  // Guardar cambios (añadir o editar)
  guardar() {
    if (this.esNuevo) {
    if (this.entidadTipo === 'reservas' || this.entidadTipo === 'habitaciones') {
      if (!this.editandoEntidad.establecimiento) {
        this.editandoEntidad.establecimiento = {};
      }
    }
    this.agregarEntidad();
  } else {
    this.actualizarEntidad();
  }
}

  // Añadir entidad usando AdminService
  agregarEntidad() {
    switch(this.entidadTipo) {
      case 'reservas':
        this.adminService.addReserva(this.editandoEntidad).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al crear reserva:', err); }
        });
        break;
      case 'personas':
        this.adminService.addPersona(this.editandoEntidad).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al crear persona:', err); }
        });
        break;
      case 'habitaciones':
        this.adminService.addHabitacion(this.editandoEntidad).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al crear habitación:', err); }
  });
  break;
      case 'establecimientos':
        this.adminService.addEstablecimiento(this.editandoEntidad).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al crear establecimiento:', err); }
        });
        break;
      case 'usuarios':
        this.adminService.addUsuario(this.editandoEntidad).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al crear usuario:', err); }
        });
        break;
    }
  }

  // Actualizar entidad
  actualizarEntidad() {
    switch(this.entidadTipo) {
      case 'reservas':
        this.adminService.updateReserva(this.editandoEntidad.id, this.editandoEntidad).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al actualizar reserva:', err); }
        });
        break;
      case 'personas':
        this.adminService.updatePersona(this.editandoEntidad.dni, this.editandoEntidad).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al actualizar persona:', err); }
        });
        break;
      case 'habitaciones':
        this.adminService.updateHabitacion(this.editandoEntidad.id, this.editandoEntidad).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al actualizar habitación:', err); }
        });
        break;
      case 'establecimientos':
        this.adminService.updateEstablecimiento(this.editandoEntidad.id, this.editandoEntidad).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al actualizar establecimiento:', err); }
        });
        break;
      case 'usuarios':
        this.adminService.updateUsuario(this.editandoEntidad.id, this.editandoEntidad).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al actualizar usuario:', err); }
        });
        break;
    }
  }

  // Eliminar entidad
  eliminarEntidad(tipo: string, entidad: any) {
    if(!confirm('¿Seguro que deseas eliminar este elemento?')) return;
    switch(tipo) {
      case 'reservas':
        this.adminService.deleteReserva(entidad.id).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al eliminar reserva:', err); }
        });
        break;
      case 'personas':
        this.adminService.deletePersona(entidad.dni).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al eliminar persona:', err); }
        });
        break;
      case 'habitaciones':
        this.adminService.deleteHabitacion(entidad.id).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al eliminar habitación:', err); }
        });
        break;
      case 'establecimientos':
        this.adminService.deleteEstablecimiento(entidad.id).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al eliminar establecimiento:', err); }
        });
        break;
      case 'usuarios':
        this.adminService.deleteUsuario(entidad.id).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al eliminar usuario:', err); }
        });
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

  // Comprobar disponibilidad
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
    });
  }

  // Filtros y reset para cada entidad
  aplicarFiltroReservas() {
    this.buscandoReservas = !!(this.filtroReservas.dni || this.filtroReservas.establecimientoId || this.filtroReservas.fechaDesde || this.filtroReservas.fechaHasta);
    const { dni, establecimientoId, fechaDesde, fechaHasta } = this.filtroReservas;

    this.reservasFiltradas = this.reservas.filter(r => {
      const coincideDni = !dni || r.persona.dni.toLowerCase().includes(dni.toLowerCase());
      const coincideEstablecimiento = !establecimientoId || r.establecimiento.id.toString().includes(establecimientoId);
      
      const fechaEntrada = new Date(r.fechaEntrada);
      const desde = fechaDesde ? new Date(fechaDesde) : null;
      const hasta = fechaHasta ? new Date(fechaHasta) : null;
      const coincideFechas = (!desde || fechaEntrada >= desde) && (!hasta || fechaEntrada <= hasta);

      return coincideDni && coincideEstablecimiento && coincideFechas;
    });
  }

  resetearFiltrosReservas() {
    this.filtroReservas = { dni: '', establecimientoId: '', fechaDesde: '', fechaHasta: '' };
    this.buscandoReservas = false;
    this.reservasFiltradas = [...this.reservas];
  }

  aplicarFiltroPersonas() {
    this.buscandoPersonas = !!(this.filtroPersonas.nombre || this.filtroPersonas.apellidos || this.filtroPersonas.dni);
    const { nombre, apellidos, dni } = this.filtroPersonas;
    this.personasFiltradas = this.personas.filter(p =>
      (!nombre || p.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!apellidos || p.apellidos.toLowerCase().includes(apellidos.toLowerCase())) &&
      (!dni || p.dni.toLowerCase().includes(dni.toLowerCase()))
    );
  }

  resetearFiltrosPersonas() {
    this.filtroPersonas = { nombre: '', apellidos: '', dni: '' };
    this.buscandoPersonas = false;
    this.personasFiltradas = [...this.personas];
  }

  aplicarFiltroHabitaciones() {
    this.buscandoHabitaciones = !!(this.filtroHabitaciones.numero || this.filtroHabitaciones.tipo || this.filtroHabitaciones.estado || this.filtroHabitaciones.establecimientoId);
    const { numero, tipo, estado, establecimientoId } = this.filtroHabitaciones;
    this.habitacionesFiltradas = this.habitaciones.filter(h =>
      (!numero || h.numero.toString().includes(numero)) &&
      (!tipo || h.tipo.toLowerCase().includes(tipo.toLowerCase())) &&
      (!estado || h.estado.toLowerCase().includes(estado.toLowerCase())) &&
      (!establecimientoId || h.establecimiento.id.toString().includes(establecimientoId))
    );
  }

  resetearFiltrosHabitaciones() {
    this.filtroHabitaciones = { numero: '', tipo: '', estado: '', establecimientoId: '' };
    this.buscandoHabitaciones = false;
    this.habitacionesFiltradas = [...this.habitaciones];
  }

  aplicarFiltroEstablecimientos() {
    this.buscandoEstablecimientos = !!(this.filtroEstablecimientos.nombre || this.filtroEstablecimientos.direccion || this.filtroEstablecimientos.telefono || this.filtroEstablecimientos.capacidad);
    const { nombre, direccion, telefono, capacidad } = this.filtroEstablecimientos;
    this.establecimientosFiltrados = this.establecimientos.filter(e =>
      (!nombre || e.nombre.toLowerCase().includes(nombre.toLowerCase())) &&
      (!direccion || e.direccion.toLowerCase().includes(direccion.toLowerCase())) &&
      (!telefono || e.telefono.toLowerCase().includes(telefono.toLowerCase())) &&
      (!capacidad || e.capacidad.toString().includes(capacidad))
    );
  }

  resetearFiltrosEstablecimientos() {
    this.filtroEstablecimientos = { nombre: '', direccion: '', telefono: '', capacidad: '' };
    this.buscandoEstablecimientos = false;
    this.establecimientosFiltrados = [...this.establecimientos];
  }

  aplicarFiltroUsuarios() {
    this.buscandoUsuarios = !!(this.filtroUsuarios.nombreUsuario || this.filtroUsuarios.rol || this.filtroUsuarios.email);
    const { nombreUsuario, rol, email } = this.filtroUsuarios;
    this.usuariosFiltrados = this.usuarios.filter(u =>
      (!nombreUsuario || u.nombreUsuario.toLowerCase().includes(nombreUsuario.toLowerCase())) &&
      (!rol || u.rol.toLowerCase().includes(rol.toLowerCase())) &&
      (!email || u.email.toLowerCase().includes(email.toLowerCase()))
    );
  }

  resetearFiltrosUsuarios() {
    this.filtroUsuarios = { nombreUsuario: '', rol: '', email: '' };
    this.buscandoUsuarios = false;
    this.usuariosFiltrados = [...this.usuarios];
  }
}