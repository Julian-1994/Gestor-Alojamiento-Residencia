import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HabitacionService } from '../servicios/habitacion.service';
import { HabitacionDTO } from '../model/HabitacionDTO.model';
import { EstablecimientoDTO } from '../model/EstablecimientoDTO.model';
import { ReservaDTO } from '../model/ReservaDTO.model';

@Component({
  selector: 'app-habitacion',
  templateUrl: './habitacion.component.html',
  styleUrls: ['./habitacion.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class HabitacionComponent implements OnInit {

  @Input() habitaciones: HabitacionDTO[] = [];
  @Input() establecimientos: EstablecimientoDTO[] = [];
  @Input() reservas: ReservaDTO[] = [];
  @Input() filtroHabitaciones: any;
  @Input() habitacionesFiltradas: HabitacionDTO[] = [];
  @Input() buscandoHabitaciones: boolean = false;
  @Input() editandoEntidad: HabitacionDTO | null = null;
  @Input() esNuevo: boolean = false;
  @Input() habitacionesDisponibilidad: any[] = [];
  @Input() fechaDisponibilidadInicio: string = '';
  @Input() fechaDisponibilidadFin: string = '';
  @Input() establecimientoDisponibilidadId: number | undefined = undefined;

  constructor(private habitacionService: HabitacionService) {}

  ngOnInit(): void {}

  abrirNuevo() {
    this.esNuevo = true;
    this.editandoEntidad = {
      id: 0,
      numero: '',
      tipo: '',
      estado: 'DISPONIBLE',
      establecimientoId: 0
    } as HabitacionDTO;
  }

  abrirEditar(habitacion: HabitacionDTO) {
    this.esNuevo = false;
    this.editandoEntidad = { ...habitacion };
  }

  guardar() {
    if (this.esNuevo) {
      this.habitacionService.addHabitacion(this.editandoEntidad!).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al crear habitación:', err); }
      });
    } else {
      this.habitacionService.updateHabitacion(this.editandoEntidad!.id, this.editandoEntidad!).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al actualizar habitación:', err); }
      });
    }
  }

  eliminar(habitacion: HabitacionDTO) {
    if (!confirm('¿Seguro que deseas eliminar este elemento?')) return;
    this.habitacionService.deleteHabitacion(habitacion.id).subscribe({
      next: () => { this.postOperacion(); },
      error: (err) => { console.error('Error al eliminar habitación:', err); }
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

  verDisponibilidadHabitaciones() {
    if (!this.establecimientoDisponibilidadId || !this.fechaDisponibilidadInicio || !this.fechaDisponibilidadFin) {
      alert('Debe seleccionar establecimiento y fechas');
      return;
    }
    const entrada = new Date(this.fechaDisponibilidadInicio);
    const salida = new Date(this.fechaDisponibilidadFin);

    const habitacionesEst = this.habitaciones.filter(h => h.establecimientoId === this.establecimientoDisponibilidadId);
    if (habitacionesEst.length === 0) {
      alert('No hay habitaciones en este establecimiento');
      return;
    }
    if (entrada >= salida) {
      alert('La fecha de entrada debe ser anterior a la de salida');
      return;
    }

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
  }

  verTodasHabitaciones() {
    this.habitacionesDisponibilidad = [];
  }

  getEstablecimientoNombre(id: number): string {
    const est = this.establecimientos?.find((e: any) => e.id === id);
    return est ? est.nombre : id.toString();
  }
}