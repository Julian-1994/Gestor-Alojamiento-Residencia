import { Component, OnInit } from '@angular/core';
import { AdminService } from './admin.service';
import { Reserva } from '../model/reserva.model';
import { Persona } from '../model/persona.model';
import { Habitacion } from '../model/habitacion.model';
import { Establecimiento } from '../model/establecimiento.model';
import { Usuario } from '../model/usuario.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
  standalone: true,
  imports: [CommonModule],
})
export class AdminComponent implements OnInit {

  reservas: Reserva[] = [];
  personas: Persona[] = [];
  habitaciones: Habitacion[] = [];
  establecimientos: Establecimiento[] = [];
  usuarios: Usuario[] = [];

  constructor(private adminService: AdminService) {}

    ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.adminService.getReservas().subscribe({
      next: (data) => {
        this.reservas = data;
console.log(this.reservas);

      },
      error: (err) => {
        console.error('Error al cargar reservas:', err);
      }
    });

    this.adminService.getPersonas().subscribe({
      next: (data) => {
        this.personas = data;
        console.log('Personas:', data);
      },
      error: (err) => {
        console.error('Error al cargar personas:', err);
      }
    });

    this.adminService.getHabitaciones().subscribe({
      next: (data) => {
        this.habitaciones = data;
        console.log('Habitaciones:', data);
      },
      error: (err) => {
        console.error('Error al cargar habitaciones:', err);
      }
    });

    this.adminService.getEstablecimientos().subscribe({
      next: (data) => {
        this.establecimientos = data;
        console.log('Establecimientos:', data);
      },
      error: (err) => {
        console.error('Error al cargar establecimientos:', err);
      }
    });

    this.adminService.getUsuarios().subscribe({
      next: (data) => {
        this.usuarios = data;
        console.log('Usuarios:', data);
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });
  }
}