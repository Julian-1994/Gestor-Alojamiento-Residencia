import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reserva } from '../model/reserva.model';
import { Persona } from '../model/persona.model';
import { Habitacion } from '../model/habitacion.model';
import { Establecimiento } from '../model/establecimiento.model';
import { Usuario } from '../model/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private baseUrl = 'http://localhost:9020/api';
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  // Método para convertir fechas al formato Date
  private convertDateToISO(date: string): Date | null {
    if (!date) {
      return null;
    }
    const [year, month, day] = date.split('-');
    return new Date(`${year}-${month}-${day}`);
  }

  // Método para convertir Date a string en formato ISO
  private dateToString(date: Date | null): string {
    if (!date) {
      return '';
    }
    try {
      return date.toISOString().split('T')[0]; // Obtiene solo la parte de la fecha
    } catch (error) {
      console.error('Error al convertir fecha:', error);
      return ''; // Devuelve una cadena vacía o maneja el error de otra manera
    }
  }

  // GET
  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}/reservas`, { withCredentials: true }).pipe(
      map(reservas => reservas.map(reserva => ({
        ...reserva,
        fechaEntrada: this.dateToString(this.convertDateToISO(reserva.fechaEntrada)),
        fechaSalida: this.dateToString(this.convertDateToISO(reserva.fechaSalida)),
      })))
    );
  }

  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.baseUrl}/personas`, { withCredentials: true }).pipe(
      map(personas => personas.map(persona => ({
        ...persona,
        fechaNacimiento: this.dateToString(this.convertDateToISO(persona.fechaNacimiento)),
      })))
    );
  }

  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.baseUrl}/habitaciones`, { withCredentials: true });
  }

  getEstablecimientos(): Observable<Establecimiento[]> {
    return this.http.get<Establecimiento[]>(`${this.baseUrl}/establecimientos`, { withCredentials: true });
  }

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`, { withCredentials: true });
  }

  // POST
  addReserva(reserva: Reserva): Observable<any> {
    const formattedReserva = {
      ...reserva,
      fechaEntrada: this.dateToString(this.convertDateToISO(reserva.fechaEntrada)),
      fechaSalida: this.dateToString(this.convertDateToISO(reserva.fechaSalida)),
    };
    return this.http.post(`${this.baseUrl}/reservas`, formattedReserva, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  addPersona(persona: Persona): Observable<any> {
    const formattedPersona = {
      ...persona,
      fechaNacimiento: this.dateToString(this.convertDateToISO(persona.fechaNacimiento)),
    };
    return this.http.post(`${this.baseUrl}/personas`, formattedPersona, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  addHabitacion(habitacion: Habitacion): Observable<any> {
    return this.http.post(`${this.baseUrl}/habitaciones`, habitacion, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  addEstablecimiento(establecimiento: Establecimiento): Observable<any> {
    return this.http.post(`${this.baseUrl}/establecimientos`, establecimiento, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  addUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, usuario, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  // PUT
  updateReserva(id: number, reserva: Reserva): Observable<any> {
    const formattedReserva = {
      ...reserva,
      fechaEntrada: this.dateToString(this.convertDateToISO(reserva.fechaEntrada)),
      fechaSalida: this.dateToString(this.convertDateToISO(reserva.fechaSalida)),
    };
    return this.http.put(`${this.baseUrl}/reservas/${id}`, formattedReserva, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  updatePersona(dni: string, persona: Persona): Observable<any> {
    const formattedPersona = {
      ...persona,
      fechaNacimiento: this.dateToString(this.convertDateToISO(persona.fechaNacimiento)),
    };
    return this.http.put(`${this.baseUrl}/personas/${dni}`, formattedPersona, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  updateHabitacion(id: number, habitacion: Habitacion): Observable<any> {
    return this.http.put(`${this.baseUrl}/habitaciones/${id}`, habitacion, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  updateEstablecimiento(id: number, establecimiento: Establecimiento): Observable<any> {
    return this.http.put(`${this.baseUrl}/establecimientos/${id}`, establecimiento, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  updateUsuario(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, usuario, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  // DELETE
  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/reservas/${id}`, { withCredentials: true });
  }

  deletePersona(dni: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/personas/${dni}`, { withCredentials: true });
  }

  deleteHabitacion(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/habitaciones/${id}`, { withCredentials: true });
  }

  deleteEstablecimiento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/establecimientos/${id}`, { withCredentials: true });
  }

  deleteUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/usuarios/${id}`, { withCredentials: true });
  }

  // GET Habitaciones Disponibles
  getHabitacionesDisponibles(fechaEntrada: string, fechaSalida: string): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.baseUrl}/habitaciones/disponibles?}`, { withCredentials: true });
  }
}