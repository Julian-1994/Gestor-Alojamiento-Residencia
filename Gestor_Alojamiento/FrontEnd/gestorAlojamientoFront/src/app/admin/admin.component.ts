import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaComponent } from '../reserva/reserva.component';
import { PersonaComponent } from '../persona/persona.component';
import { EstablecimientoComponent } from '../establecimiento/establecimiento.component';
import { HabitacionComponent } from '../habitacion/habitacion.component';
import { UsuarioComponent } from '../usuario/usuario.component';
import { ReservaService } from '../servicios/reserva.service';
import { PersonaService } from '../servicios/persona.service';
import { EstablecimientoService } from '../servicios/establecimiento.service';
import { HabitacionService } from '../servicios/habitacion.service';
import { UsuarioService } from '../servicios/usuario.service';
import { ReservaDTO } from '../model/ReservaDTO.model';
import { PersonaDTO } from '../model/PersonaDTO.model';
import { EstablecimientoDTO } from '../model/EstablecimientoDTO.model';
import { HabitacionDTO } from '../model/HabitacionDTO.model';
import { Usuario } from '../model/usuario.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, ReservaComponent, PersonaComponent, EstablecimientoComponent, HabitacionComponent, UsuarioComponent],
})
export class AdminComponent implements OnInit {

  usuarioActual: any = null;

  // Control de visibilidad para tablas
  mostrarReservas = false;
  mostrarPersonas = false;
  mostrarHabitaciones = false;
  mostrarEstablecimientos = false;
  mostrarUsuarios = false;

  // Datos para pasar a los componentes
  reservas: ReservaDTO[] = [];
  personas: PersonaDTO[] = [];
  habitaciones: HabitacionDTO[] = [];
  establecimientos: EstablecimientoDTO[] = [];
  usuarios: Usuario[] = [];

  // Filtros y estados de búsqueda
  filtroReservas = { dni: '', establecimientoId: '', fechaDesde: '', fechaHasta: '' };
  filtroPersonas = { nombre: '', apellidos: '', dni: '' };
  filtroHabitaciones = { numero: '', tipo: '', estado: '', establecimientoId: '' };
  filtroEstablecimientos = { nombre: '', direccion: '', telefono: '', capacidad: '' };
  filtroUsuarios = { nombreUsuario: '', rol: '', email: '' };

  reservasFiltradas: ReservaDTO[] = [];
  personasFiltradas: PersonaDTO[] = [];
  habitacionesFiltradas: HabitacionDTO[] = [];
  establecimientosFiltrados: EstablecimientoDTO[] = [];
  usuariosFiltrados: Usuario[] = [];

  // Variables para formularios de edición/añadir
  editandoEntidad: any = null;   // objeto actual para editar (siempre DTO)
  entidadTipo: string = '';      // reserva, persona, habitacion, etc.
  esNuevo: boolean = false;      // si es añadir o editar

  // Métodos fecha
  fechaDisponibilidadInicio: string = '';
  fechaDisponibilidadFin: string = '';
  habitacionesDisponibilidad: any[] = [];
  establecimientoDisponibilidadId: number | undefined = undefined;
  habitacionesFiltradasPorEstablecimiento: HabitacionDTO[] = [];

  // Estados de búsqueda
  buscandoReservas = false;
  buscandoPersonas = false;
  buscandoHabitaciones = false;
  buscandoEstablecimientos = false;
  buscandoUsuarios = false;
    pacienteSeleccionado: PersonaDTO | null = null;


  constructor(
    private reservaService: ReservaService,
    private personaService: PersonaService,
    private establecimientoService: EstablecimientoService,
    private habitacionService: HabitacionService,
    private usuarioService: UsuarioService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario') || 'null');
  }

  cargarDatos(): void {
    this.reservaService.getReservas().subscribe({
      next: (data) => { this.reservas = data; this.reservasFiltradas = data; },
      error: (err) => { console.error('Error al cargar reservas:', err); }
    });
    this.personaService.getPersonas().subscribe({
      next: (data) => { this.personas = data; this.personasFiltradas = data; },
      error: (err) => { console.error('Error al cargar personas:', err); }
    });
    this.habitacionService.getHabitaciones().subscribe({
      next: (data) => { this.habitaciones = data; this.habitacionesFiltradas = data; },
      error: (err) => { console.error('Error al cargar habitaciones:', err); }
    });
    this.establecimientoService.getEstablecimientos().subscribe({
      next: (data) => { this.establecimientos = data; this.establecimientosFiltrados = data; },
      error: (err) => { console.error('Error al cargar establecimientos:', err); }
    });
    this.usuarioService.getUsuarios().subscribe({
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

  cerrarSesion() {
    fetch('http://localhost:9020/logout', {
      method: 'POST',
      credentials: 'include'
    })
    .then(() => {
      localStorage.removeItem('usuario');
      window.location.href = '/login';
    });
  }
}