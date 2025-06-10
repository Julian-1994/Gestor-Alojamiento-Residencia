import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../servicios/reserva.service';
import { PersonaService } from '../servicios/persona.service';
import { EstablecimientoService } from '../servicios/establecimiento.service';
import { HabitacionService } from '../servicios/habitacion.service';
import { UsuarioService } from '../servicios/usuario.service';
import { ReservaDTO } from '../model/ReservaDTO.model';
import { PersonaDTO } from '../model/PersonaDTO.model';
import { EstablecimientoDTO } from '../model/EstablecimientoDTO.model';
import { HabitacionDTO } from '../model/HabitacionDTO.model';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UserComponent implements OnInit {

  usuarioActual: any = null;

  // Datos para pasar a los componentes
  reservas: ReservaDTO[] = [];
  personas: PersonaDTO[] = [];
  habitaciones: HabitacionDTO[] = [];
  establecimientos: EstablecimientoDTO[] = [];
 
  // Variables para formularios de edición/añadir
  editandoEntidad: any = null;   // objeto actual para editar (siempre DTO)
  entidadTipo: string = '';      // reserva, persona, habitacion, etc.
  esNuevo: boolean = false;      // si es añadir o editar

  // Métodos fecha
  fechaDisponibilidadInicio: string = '';
  fechaDisponibilidadFin: string = '';
  habitacionesDisponibilidad: any[] = [];
  habitacionesFiltradasPorEstablecimiento: HabitacionDTO[] = [];

  // Formulario para añadir persona
  mostrarFormularioPersona = false;
  nuevaPersona: PersonaDTO = {
    nombre: '', apellidos: '', dni: '',
    fechaNacimiento: '',
    telefono: '',
    email: '',
  };

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
      next: (data) => { this.reservas = data; },
      error: (err) => { console.error('Error al cargar reservas:', err); }
    });
    this.personaService.getPersonas().subscribe({
      next: (data) => { this.personas = data; },
      error: (err) => { console.error('Error al cargar personas:', err); }
    });
    this.habitacionService.getHabitaciones().subscribe({
      next: (data) => { this.habitaciones = data; },
      error: (err) => { console.error('Error al cargar habitaciones:', err); }
    });
    this.establecimientoService.getEstablecimientos().subscribe({
      next: (data) => { this.establecimientos = data; },
      error: (err) => { console.error('Error al cargar establecimientos:', err); }
    });
  }

  filtrarHabitacionesPorEstablecimiento(establecimientoId: number) {
    this.habitacionesFiltradasPorEstablecimiento = this.habitaciones.filter(
      h => h.establecimientoId === establecimientoId
    );
  }

  abrirNuevo() {
    if (this.personas.length === 0 || this.establecimientos.length === 0 || this.habitaciones.length === 0) {
      // Recargar datos y abrir cuando terminen
      this.personaService.getPersonas().subscribe(personas => {
        this.personas = personas;
        this.establecimientoService.getEstablecimientos().subscribe(establecimientos => {
          this.establecimientos = establecimientos;
          this.habitacionService.getHabitaciones().subscribe(habitaciones => {
            this.habitaciones = habitaciones;
            this.inicializarNuevaReserva();
          });
        });
      });
    } else {
      this.inicializarNuevaReserva();
    }
  }

  inicializarNuevaReserva() {
    this.esNuevo = true;
    this.editandoEntidad = {
      id: 0,
      personaDni: this.personas.length > 0 ? this.personas[0].dni : '',
      establecimientoId: this.establecimientos.length > 0 ? this.establecimientos[0].id : 0,
      habitacionId: 0,
      fechaEntrada: '',
      fechaSalida: '',
      motivoEntrada: '',
      observaciones: ''
    };
    this.filtrarHabitacionesPorEstablecimiento(this.editandoEntidad.establecimientoId);
  }

  abrirFormularioPersona() {
    this.mostrarFormularioPersona = true;
    this.nuevaPersona = { nombre: '', apellidos: '', dni: '', fechaNacimiento: '', telefono: '', email: '' }; // limpia el formulario
  }

  guardarPersona() {
    this.personaService.addPersona(this.nuevaPersona).subscribe({
      next: () => {
        alert('Persona añadida correctamente');
        this.mostrarFormularioPersona = false;
        this.cargarDatos();
      },
      error: (err) => { console.error('Error al añadir persona:', err); }
    });
  }

  guardar() {
    if (this.esNuevo && this.editandoEntidad) {
      this.reservaService.addReserva([this.editandoEntidad]).subscribe({
        next: () => { alert('Reserva creada exitosamente'); this.cargarDatos(); },
        error: (err) => { console.error('Error al crear reserva:', err); }
      });
    }
    this.cancelar();
  }

  cancelar() {
    this.editandoEntidad = null;
    this.esNuevo = false;
    this.mostrarFormularioPersona = false;
  }

  cerrarSesion() {
    fetch('http://localhost:9020/logout', {
      method: 'POST',
      credentials: 'include' // Importante para enviar la cookie de sesión
    })
    .then(() => {
      localStorage.removeItem('usuario'); // Limpia datos locales si los usas
      window.location.href = '/login';    // Redirige al login
    });
  }
}