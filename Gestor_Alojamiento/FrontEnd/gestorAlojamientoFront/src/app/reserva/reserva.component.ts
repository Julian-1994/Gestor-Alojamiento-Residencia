import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReservaService } from '../servicios/reserva.service';
import { ReservaDTO } from '../model/ReservaDTO.model';
import { PersonaDTO } from '../model/PersonaDTO.model';
import { EstablecimientoDTO } from '../model/EstablecimientoDTO.model';
import { HabitacionDTO } from '../model/HabitacionDTO.model';

@Component({
  selector: 'app-reserva',
  templateUrl: './reserva.component.html',
  styleUrls: ['./reserva.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class ReservaComponent implements OnInit {

  @Input() reservas: ReservaDTO[] = [];
  @Input() personas: PersonaDTO[] = [];
  @Input() establecimientos: EstablecimientoDTO[] = [];
  @Input() habitaciones: HabitacionDTO[] = [];
  @Input() habitacionesFiltradasPorEstablecimiento: HabitacionDTO[] = [];
  @Input() filtroReservas: any;
  @Input() reservasFiltradas: ReservaDTO[] = [];
  @Input() buscandoReservas: boolean = false;
  @Input() pacienteSeleccionado: any = null;
  @Input() editandoEntidad: ReservaDTO | null = null;
  @Input() esNuevo: boolean = false;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {}

  abrirNuevo() {
    this.esNuevo = true;
    this.editandoEntidad = {
      personaDni: '',
      establecimientoId: 0,
      habitacionId: 0,
      fechaEntrada: '',
      fechaSalida: '',
      motivoEntrada: '',
      observaciones: ''
    } as ReservaDTO;
  }

  abrirEditar(reserva: ReservaDTO) {
    this.esNuevo = false;
    this.editandoEntidad = { ...reserva };
  }

  guardar() {
    if (this.esNuevo) {
      this.reservaService.addReserva([this.editandoEntidad!]).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al crear reserva:', err); }
      });
    } else {
      this.reservaService.updateReserva(this.editandoEntidad!.id!, this.editandoEntidad!).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al actualizar reserva:', err); }
      });
    }
  }

  eliminar(reserva: ReservaDTO) {
    if (!confirm('¿Seguro que deseas eliminar este elemento?')) return;
    this.reservaService.deleteReserva(reserva.id!).subscribe({
      next: () => { this.postOperacion(); },
      error: (err) => { console.error('Error al eliminar reserva:', err); }
    });
  }

  postOperacion() {
    this.editandoEntidad = null;
    this.esNuevo = false;
  }

  cancelar() {
    this.editandoEntidad = null;
    this.esNuevo = false;
  }

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

  verPaciente(dni: string) {
    this.pacienteSeleccionado = this.personas.find(p => p.dni === dni);
  }

  cerrarPaciente() {
    this.pacienteSeleccionado = null;
  }

  getNombrePersonaDeReserva(reserva: ReservaDTO): string {
    const persona = this.personas.find(p => p.dni === reserva.personaDni);
    return persona ? `${persona.nombre} ${persona.apellidos}` : reserva.personaDni;
  }

  getNombreEstablecimientoDeReserva(reserva: ReservaDTO): string {
    const est = this.establecimientos.find(e => e.id === reserva.establecimientoId);
    return est ? est.nombre : reserva.establecimientoId.toString();
  }

  getNumeroHabitacionDeReserva(reserva: ReservaDTO): string {
    const hab = this.habitaciones.find(h => h.id === reserva.habitacionId);
    return hab ? hab.numero.toString() : reserva.habitacionId.toString();
  }
}