import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EstablecimientoDTO } from '../model/EstablecimientoDTO.model';

@Injectable({
  providedIn: 'root'
})
export class EstablecimientoService {
  private baseUrl = 'http://localhost:9020/api/establecimientos';
  private jsonHeaders = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient) {}

  getEstablecimientos(): Observable<EstablecimientoDTO[]> {
    return this.http.get<EstablecimientoDTO[]>(this.baseUrl, { withCredentials: true });
  }

  getEstablecimientoById(id: number): Observable<EstablecimientoDTO> {
    return this.http.get<EstablecimientoDTO>(`${this.baseUrl}/${id}`, { withCredentials: true });
  }

  addEstablecimiento(establecimientoDTO: EstablecimientoDTO): Observable<any> {
    return this.http.post(this.baseUrl, establecimientoDTO, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  updateEstablecimiento(id: number, establecimientoDTO: EstablecimientoDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, establecimientoDTO, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  deleteEstablecimiento(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { withCredentials: true });
  }
}