import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { PersonaDTO } from '../model/PersonaDTO.model';
import { HabitacionDTO } from '../model/HabitacionDTO.model';
import { EstablecimientoDTO } from '../model/EstablecimientoDTO.model';
import { Usuario } from '../model/usuario.model';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaDTO } from '../model/ReservaDTO.model';

declare var $: any; // Importante para usar jQuery/Select2

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class AdminComponent implements OnInit {

  reservas: ReservaDTO[] = [];
  personas: PersonaDTO[] = [];
  habitaciones: HabitacionDTO[] = [];
  establecimientos: EstablecimientoDTO[] = [];
  usuarios: Usuario[] = [];
  usuarioActual: any = null;


  // Control de visibilidad para tablas
  mostrarReservas = false;
  mostrarPersonas = false;
  mostrarHabitaciones = false;
  mostrarEstablecimientos = false;
  mostrarUsuarios = false;

  // Variables para formularios de edición/añadir
  editandoEntidad: any = null;   // objeto actual para editar (siempre DTO)
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
  pacienteSeleccionado: any = null;


  filtroReservas = { dni: '', establecimientoId: '', fechaDesde: '', fechaHasta: '' };
  filtroPersonas = { nombre: '', apellidos: '', dni: '' };
  filtroHabitaciones = { numero: '', tipo: '', estado: '', establecimientoId: '' };
  filtroEstablecimientos = { nombre: '', direccion: '', telefono: '', capacidad: '' };
  filtroUsuarios = { nombreUsuario: '', rol: '', email: '' };
  filtroPersonaReserva: string = '';

  reservasFiltradas: ReservaDTO[] = [];
  personasFiltradas: PersonaDTO[] = [];
  habitacionesFiltradas: HabitacionDTO[] = [];
  establecimientosFiltrados: EstablecimientoDTO[] = [];
  establecimientoDisponibilidadId: number | undefined = undefined;
  usuariosFiltrados: Usuario[] = [];
  habitacionesFiltradasPorEstablecimiento: HabitacionDTO[] = [];
  
  cargandoEstablecimientos = true;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.usuarioActual = JSON.parse(localStorage.getItem('usuario') || 'null');

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
      next: (data) => { this.establecimientos = data; this.establecimientosFiltrados = data; this.cargandoEstablecimientos = false; },
      error: (err) => { console.error('Error al cargar establecimientos:', err); }
    });
    this.adminService.getUsuarios().subscribe({
      next: (data) => { this.usuarios = data; this.usuariosFiltrados = data; },
      error: (err) => { console.error('Error al cargar usuarios:', err); this.cargandoEstablecimientos = false;}
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
    switch(tipo) {
      case 'reservas':
          const primerEstablecimientoId = this.establecimientos[0]?.id || 0;
          this.editandoEntidad = {
          personaDni: this.personas[0]?.dni || '',
          establecimientoId: this.establecimientos[0]?.id || 0,
          habitacionId: 0,
          fechaEntrada: '',
          fechaSalida: '',
          motivoEntrada: '',
          observaciones: ''
        } as ReservaDTO;
            this.filtrarHabitacionesPorEstablecimiento(primerEstablecimientoId);
            this.editandoEntidad.habitacionId = null;
                 setTimeout(() => this.initSelect2Persona(), 0);

        break;
      case 'personas':
        this.editandoEntidad = {
          dni: '',
          nombre: '',
          apellidos: '',
          fechaNacimiento: '',
          telefono: '',
          email: ''
        } as PersonaDTO;
        break;
      case 'habitaciones':
        this.editandoEntidad = {
          id: 0,
          numero: '',
          tipo: '',
          estado: 'DISPONIBLE', // Usa un valor válido de EstadoHabitacion
          establecimientoId: this.establecimientos[0]?.id || 0,
        } as HabitacionDTO;
        break;
  
      case 'establecimientos':
        this.editandoEntidad = {
          id: 0,
          nombre: '',
          direccion: '',
          telefono: '',
          capacidad: 0
        } as EstablecimientoDTO;
        break;
      case 'usuarios':
        this.editandoEntidad = {
          id: 0,
          nombreUsuario: '',
          contrasenya: '',
          rol: '',
          email: ''
        } as Usuario;
        break;
    }
  }

  // Abrir formulario para editar
  abrirEditar(tipo: string, entidad: any) {
    this.entidadTipo = tipo;
    this.esNuevo = false;
    this.editandoEntidad = { ...entidad }; // clonar objeto para no editar original directo
   if (tipo === 'reservas') {
       this.filtrarHabitacionesPorEstablecimiento(this.editandoEntidad.establecimientoId);
    setTimeout(() => this.initSelect2Persona(), 0);
  }
  }
  onEstablecimientoReservaChange() {
  this.filtrarHabitacionesPorEstablecimiento(this.editandoEntidad.establecimientoId);
  this.editandoEntidad.habitacionId = null; // Limpia la selección de habitación
}

abrirReservaTrasRecarga() {
  this.adminService.getHabitaciones().subscribe({
    next: (data) => {
      this.habitaciones = data;
      this.habitacionesFiltradas = data;
      // Ahora sí, abre el modal de reserva
      this.abrirNuevo('reservas');
    },
    error: (err) => { console.error('Error al recargar habitaciones:', err); }
  });
}
// Inicializa Select2 para el select de persona DNI
  initSelect2Persona() {
    const select = $('#select-persona-dni');
    select.off('change').select2({
      width: '100%',
      placeholder: 'Buscar por DNI o nombre',
      dropdownParent: select.closest('.modal')
    });
    // Set value si ya hay uno seleccionado
    if (this.editandoEntidad?.personaDni) {
      select.val(this.editandoEntidad.personaDni).trigger('change');
    }
    // Actualiza el modelo Angular al cambiar
    select.on('change', (e: any) => {
      this.editandoEntidad.personaDni = e.target.value;
    });
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
        // Solo los campos del DTO
        const reservaDTO: ReservaDTO = {
          personaDni: this.editandoEntidad.personaDni,
          establecimientoId: this.editandoEntidad.establecimientoId,
          habitacionId: this.editandoEntidad.habitacionId,
          fechaEntrada: this.editandoEntidad.fechaEntrada,
          fechaSalida: this.editandoEntidad.fechaSalida,
          motivoEntrada: this.editandoEntidad.motivoEntrada,
          observaciones: this.editandoEntidad.observaciones
        };
        this.adminService.addReserva([reservaDTO]).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al crear reserva:', err); }
        });
        break;

      case 'personas':
        const personaDTO: PersonaDTO = {
          dni: this.editandoEntidad.dni,
          nombre: this.editandoEntidad.nombre,
          apellidos: this.editandoEntidad.apellidos,
          fechaNacimiento: this.editandoEntidad.fechaNacimiento,
          telefono: this.editandoEntidad.telefono,
          email: this.editandoEntidad.email
        };
        this.adminService.addPersona(personaDTO).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al crear persona:', err); }
        });
        break;

      case 'habitaciones':
        if (!this.editandoEntidad.numero || this.editandoEntidad.numero.trim() === '') {
    alert('Debes introducir un número de habitación');
    return;
  }
  if (!this.editandoEntidad.establecimientoId || this.editandoEntidad.establecimientoId === 0) {
    alert('Debes seleccionar un establecimiento');
    return;
  }
  if (!['DISPONIBLE', 'OCUPADA'].includes(this.editandoEntidad.estado)) {
    alert('Debes seleccionar un estado válido');
    return;
  }
  if (!['Individual', 'Doble'].includes(this.editandoEntidad.tipo)) {
    alert('Debes seleccionar un tipo válido');
    return;
  }
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
        const reservaDTO: ReservaDTO = {
          id: this.editandoEntidad.id,
          personaDni: this.editandoEntidad.personaDni,
          establecimientoId: this.editandoEntidad.establecimientoId,
          habitacionId: this.editandoEntidad.habitacionId,
          fechaEntrada: this.editandoEntidad.fechaEntrada,
          fechaSalida: this.editandoEntidad.fechaSalida,
          motivoEntrada: this.editandoEntidad.motivoEntrada,
          observaciones: this.editandoEntidad.observaciones
        };
        this.adminService.updateReserva(reservaDTO.id!, reservaDTO).subscribe({
          next: () => { this.postOperacion(); },
          error: (err) => { console.error('Error al actualizar reserva:', err); }
        });
        break;
      case 'personas':
        const personaDTO: PersonaDTO = {
          dni: this.editandoEntidad.dni,
          nombre: this.editandoEntidad.nombre,
          apellidos: this.editandoEntidad.apellidos,
          fechaNacimiento: this.editandoEntidad.fechaNacimiento,
          telefono: this.editandoEntidad.telefono,
          email: this.editandoEntidad.email
        };
        this.adminService.updatePersona(personaDTO.dni, personaDTO).subscribe({
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
  filtrarHabitacionesPorEstablecimiento(establecimientoId: number) {
  this.habitacionesFiltradasPorEstablecimiento = this.habitaciones.filter(
    h => h.establecimientoId === establecimientoId
  );
}
  // Comprobar disponibilidad
  verDisponibilidadHabitaciones() {
    if (!this.establecimientoDisponibilidadId || !this.fechaDisponibilidadInicio || !this.fechaDisponibilidadFin) {
    alert('Debe seleccionar establecimiento y fechas');
    return;
  }
    const entrada = new Date(this.fechaDisponibilidadInicio);
    const salida = new Date(this.fechaDisponibilidadFin);

     // Filtra habitaciones por establecimiento
  const habitacionesEst = this.habitaciones.filter(h => h.establecimientoId === this.establecimientoDisponibilidadId);
    if (habitacionesEst.length === 0) {
      alert('No hay habitaciones en este establecimiento');
      return;
    }
    if (entrada >= salida) {
      alert('La fecha de entrada debe ser anterior a la de salida');
      return;
    }
    // Filtra reservas por establecimiento y fechas

    this.habitacionesDisponibilidad = habitacionesEst.map(h => {
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
  });
  this.mostrarHabitaciones = false;
}

// Botón para volver a la tabla completa de habitaciones
verTodasHabitaciones() {
  this.habitacionesDisponibilidad = [];
  this.mostrarHabitaciones = true;
}

  // Filtros y reset para cada entidad
  aplicarFiltroReservas() {
    this.buscandoReservas = !!(this.filtroReservas.dni || this.filtroReservas.establecimientoId || this.filtroReservas.fechaDesde || this.filtroReservas.fechaHasta);
    const { dni, establecimientoId, fechaDesde, fechaHasta } = this.filtroReservas;

    this.reservasFiltradas = this.reservas.filter(r => {
      const coincideDni = !dni || r.personaDni.toLowerCase().includes(dni.toLowerCase());
      const coincideEstablecimiento = !establecimientoId || r.establecimientoId.toString().includes(establecimientoId);
      
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
      (!establecimientoId || h.establecimientoId.toString().includes(establecimientoId))
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

  verPaciente(dni: string) {
  this.pacienteSeleccionado = this.personas.find(p => p.dni === dni);
}

cerrarPaciente() {
  this.pacienteSeleccionado = null;
}

  // Mostrar nombre de persona en una reserva (en la tabla)
  getNombrePersonaDeReserva(reserva: ReservaDTO): string {
    const persona = this.personas.find(p => p.dni === reserva.personaDni);
    return persona ? `${persona.nombre} ${persona.apellidos}` : reserva.personaDni;
  }

  // Mostrar nombre de establecimiento en una reserva
  getNombreEstablecimientoDeReserva(reserva: ReservaDTO): string {
    const est = this.establecimientos.find(e => e.id === reserva.establecimientoId);
    return est ? est.nombre : reserva.establecimientoId.toString();
  }

  // Mostrar número de habitación en una reserva
  getNumeroHabitacionDeReserva(reserva: ReservaDTO): string {
    const hab = this.habitaciones.find(h => h.id === reserva.habitacionId);
    return hab ? hab.numero.toString() : reserva.habitacionId.toString();
  }

  // Devuelve el nombre del establecimiento dado su ID

getEstablecimientoNombre(id: number): string {
  const est = this.establecimientos?.find((e: any) => e.id === id);
  return est ? est.nombre : id.toString();
}
getPersonasFiltradasReserva() {
  if (!this.filtroPersonaReserva) return this.personas;
  const filtro = this.filtroPersonaReserva.toLowerCase();
  return this.personas.filter(p =>
    p.dni.toLowerCase().includes(filtro) ||
    p.nombre.toLowerCase().includes(filtro)
  );
}
}
