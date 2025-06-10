import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservaDTO } from '../model/ReservaDTO.model';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private baseUrl = 'http://localhost:9020/api/reservas';
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  private convertDateToISO(date: string): Date | null {
    if (!date) {
      return null;
    }
    const [year, month, day] = date.split('-');
    return new Date(`${year}-${month}-${day}`);
  }

  private dateToString(date: Date | null): string {
    if (!date) {
      return '';
    }
    try {
      const fechaStr = date.toISOString().slice(0, 10);
      return `${fechaStr}T00:00:00`;
    } catch (error) {
      console.error('Error al convertir fecha:', error);
      return '';
    }
  }

  getReservas(): Observable<ReservaDTO[]> {
    return this.http.get<ReservaDTO[]>(this.baseUrl, { withCredentials: true }).pipe(
      map(reservas => reservas.map(reserva => ({
        ...reserva,
        fechaEntrada: this.dateToString(this.convertDateToISO(reserva.fechaEntrada)),
        fechaSalida: this.dateToString(this.convertDateToISO(reserva.fechaSalida)),
      })))
    );
  }

  addReserva(reservas: ReservaDTO[]): Observable<any> {
    return this.http.post(this.baseUrl, reservas, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  updateReserva(id: number, reserva: ReservaDTO): Observable<any> {
    const dto: ReservaDTO = {
      ...reserva,
      id,
      fechaEntrada: this.dateToString(this.convertDateToISO(reserva.fechaEntrada)),
      fechaSalida: this.dateToString(this.convertDateToISO(reserva.fechaSalida)),
    };

    return this.http.put(`${this.baseUrl}/${id}`, dto, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  deleteReserva(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}