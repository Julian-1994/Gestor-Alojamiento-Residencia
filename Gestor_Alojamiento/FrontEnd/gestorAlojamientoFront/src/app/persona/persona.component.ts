import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PersonaService } from '../servicios/persona.service';
import { PersonaDTO } from '../model/PersonaDTO.model';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class PersonaComponent implements OnInit {

  @Input() personas: PersonaDTO[] = [];
  @Input() filtroPersonas: any;
  @Input() personasFiltradas: PersonaDTO[] = [];
  @Input() buscandoPersonas: boolean = false;
  @Input() editandoEntidad: PersonaDTO | null = null;
  @Input() esNuevo: boolean = false;

  constructor(private personaService: PersonaService) {}

  ngOnInit(): void {}

  abrirNuevo() {
    this.esNuevo = true;
    this.editandoEntidad = {
      dni: '',
      nombre: '',
      apellidos: '',
      fechaNacimiento: '',
      telefono: '',
      email: ''
    } as PersonaDTO;
  }

  abrirEditar(persona: PersonaDTO) {
    this.esNuevo = false;
    this.editandoEntidad = { ...persona };
  }

  guardar() {
    if (this.esNuevo) {
      this.personaService.addPersona(this.editandoEntidad!).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al crear persona:', err); }
      });
    } else {
      this.personaService.updatePersona(this.editandoEntidad!.dni, this.editandoEntidad!).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al actualizar persona:', err); }
      });
    }
  }

  eliminar(persona: PersonaDTO) {
    if (!confirm('¿Seguro que deseas eliminar este elemento?')) return;
    this.personaService.deletePersona(persona.dni).subscribe({
      next: () => { this.postOperacion(); },
      error: (err) => { console.error('Error al eliminar persona:', err); }
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
}