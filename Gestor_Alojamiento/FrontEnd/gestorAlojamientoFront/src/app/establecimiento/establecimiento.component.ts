import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EstablecimientoService } from '../servicios/establecimiento.service';
import { EstablecimientoDTO } from '../model/EstablecimientoDTO.model';

@Component({
  selector: 'app-establecimiento',
  templateUrl: './establecimiento.component.html',
  styleUrls: ['./establecimiento.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class EstablecimientoComponent implements OnInit {

  @Input() establecimientos: EstablecimientoDTO[] = [];
  @Input() filtroEstablecimientos: any;
  @Input() establecimientosFiltrados: EstablecimientoDTO[] = [];
  @Input() buscandoEstablecimientos: boolean = false;
  @Input() editandoEntidad: EstablecimientoDTO | null = null;
  @Input() esNuevo: boolean = false;

  constructor(private establecimientoService: EstablecimientoService) {}

  ngOnInit(): void {}

  abrirNuevo() {
    this.esNuevo = true;
    this.editandoEntidad = {
      id: 0,
      nombre: '',
      direccion: '',
      telefono: '',
      capacidad: 0
    } as EstablecimientoDTO;
  }

  abrirEditar(establecimiento: EstablecimientoDTO) {
    this.esNuevo = false;
    this.editandoEntidad = { ...establecimiento };
  }

  guardar() {
    if (this.esNuevo) {
      this.establecimientoService.addEstablecimiento(this.editandoEntidad!).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al crear establecimiento:', err); }
      });
    } else {
      this.establecimientoService.updateEstablecimiento(this.editandoEntidad!.id, this.editandoEntidad!).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al actualizar establecimiento:', err); }
      });
    }
  }

  eliminar(establecimiento: EstablecimientoDTO) {
    if (!confirm('¿Seguro que deseas eliminar este elemento?')) return;
    this.establecimientoService.deleteEstablecimiento(establecimiento.id).subscribe({
      next: () => { this.postOperacion(); },
      error: (err) => { console.error('Error al eliminar establecimiento:', err); }
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
}