import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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

  constructor(private http: HttpClient) {}

  // GET
  getReservas(): Observable<Reserva[]> {
    return this.http.get<Reserva[]>(`${this.baseUrl}/reservas`,  { withCredentials: true });
  }
  getPersonas(): Observable<Persona[]> {
    return this.http.get<Persona[]>(`${this.baseUrl}/personas`, { withCredentials: true });
  }
  getHabitaciones(): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(`${this.baseUrl}/habitaciones`,  { withCredentials: true });
  }
  getEstablecimientos(): Observable<Establecimiento[]> {
    return this.http.get<Establecimiento[]>(`${this.baseUrl}/establecimientos`, { withCredentials: true });
  }
  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`, { withCredentials: true });
  }

  // POST
  addReserva(reserva: Reserva): Observable<any> {
    return this.http.post(`${this.baseUrl}/reservas`, reserva, { withCredentials: true });
  }
  addPersona(persona: Persona): Observable<any> {
    return this.http.post(`${this.baseUrl}/personas`, persona, { withCredentials: true });
  }
  addHabitacion(habitacion: Habitacion): Observable<any> {
    return this.http.post(`${this.baseUrl}/habitaciones`, habitacion, { withCredentials: true });
  }
  addEstablecimiento(establecimiento: Establecimiento): Observable<any> {
    return this.http.post(`${this.baseUrl}/establecimientos`, establecimiento, { withCredentials: true });
  }
  addUsuario(usuario: Usuario): Observable<any> {
    return this.http.post(`${this.baseUrl}/usuarios`, usuario, { withCredentials: true });
  }

  // PUT
  updateReserva(id: number, reserva: Reserva): Observable<any> {
    return this.http.put(`${this.baseUrl}/reservas/${id}`, reserva, { withCredentials: true });
  }
  updatePersona(dni: string, persona: Persona): Observable<any> {
    return this.http.put(`${this.baseUrl}/personas/${dni}`, persona, { withCredentials: true });
  }
  updateHabitacion(id: number, habitacion: Habitacion): Observable<any> {
    return this.http.put(`${this.baseUrl}/habitaciones/${id}`, habitacion, { withCredentials: true });
  }
  updateEstablecimiento(id: number, establecimiento: Establecimiento): Observable<any> {
    return this.http.put(`${this.baseUrl}/establecimientos/${id}`, establecimiento, { withCredentials: true });
  }
  updateUsuario(id: number, usuario: Usuario): Observable<any> {
    return this.http.put(`${this.baseUrl}/usuarios/${id}`, usuario, { withCredentials: true });
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
}