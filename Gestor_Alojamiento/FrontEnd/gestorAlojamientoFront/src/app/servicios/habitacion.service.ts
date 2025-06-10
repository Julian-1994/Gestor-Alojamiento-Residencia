import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HabitacionDTO } from '../model/HabitacionDTO.model';
import { Habitacion } from '../model/habitacion.model';

@Injectable({
  providedIn: 'root'
})
export class HabitacionService {
  private baseUrl = 'http://localhost:9020/api/habitaciones';
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getHabitaciones(): Observable<HabitacionDTO[]> {
    return this.http.get<HabitacionDTO[]>(this.baseUrl, { withCredentials: true });
  }

  getHabitacionById(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  addHabitacion(habitacionDTO: HabitacionDTO): Observable<any> {
    return this.http.post(this.baseUrl, habitacionDTO, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  updateHabitacion(id: number, habitacionDTO: HabitacionDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, habitacionDTO, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  deleteHabitacion(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  getHabitacionesDisponibles(fechaEntrada: string, fechaSalida: string): Observable<Habitacion[]> {
    return this.http.get<Habitacion[]>(
      `${this.baseUrl}/disponibles?fechaEntrada=${fechaEntrada}&fechaSalida=${fechaSalida}`,
      { withCredentials: true }
    );
  }
}