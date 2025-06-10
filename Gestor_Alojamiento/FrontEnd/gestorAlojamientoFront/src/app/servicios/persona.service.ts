import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PersonaDTO } from '../model/PersonaDTO.model';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private baseUrl = 'http://localhost:9020/api/personas';
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

  getPersonas(): Observable<PersonaDTO[]> {
    return this.http.get<PersonaDTO[]>(this.baseUrl, { withCredentials: true }).pipe(
      map(personas => personas.map(persona => ({
        ...persona,
        fechaNacimiento: this.dateToString(this.convertDateToISO(persona.fechaNacimiento)),
      })))
    );
  }

  getPersonaByDni(dni: string): Observable<PersonaDTO> {
    return this.http.get<PersonaDTO>(`${this.baseUrl}/${dni}`, { withCredentials: true }).pipe(
      map(persona => ({
        ...persona,
        fechaNacimiento: this.dateToString(this.convertDateToISO(persona.fechaNacimiento)),
      }))
    );
  }

  addPersona(persona: PersonaDTO): Observable<any> {
    const formattedPersona = {
      ...persona,
      fechaNacimiento: this.dateToString(this.convertDateToISO(persona.fechaNacimiento)),
    };
    return this.http.post(this.baseUrl, formattedPersona, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  updatePersona(dni: string, persona: PersonaDTO): Observable<any> {
    const formattedPersona = {
      ...persona,
      fechaNacimiento: this.dateToString(this.convertDateToISO(persona.fechaNacimiento)),
    };
    return this.http.put(`${this.baseUrl}/${dni}`, formattedPersona, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  deletePersona(dni: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${dni}`, { withCredentials: true });
  }
}