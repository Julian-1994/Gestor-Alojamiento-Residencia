import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reserva } from '../model/reserva.model';
import { Persona } from '../model/persona.model';
import { Habitacion } from '../model/habitacion.model';
import { Establecimiento } from '../model/establecimiento.model';
import { Usuario } from '../model/usuario.model';
import { ReservaDTO } from '../model/ReservaDTO.model';
import { EstablecimientoDTO } from '../model/EstablecimientoDTO.model';
import { HabitacionDTO } from '../model/HabitacionDTO.model';

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
    // Creamos el string yyyy-MM-dd y añadimos T00:00:00
    const fechaStr = date.toISOString().slice(0, 10);
    return `${fechaStr}T00:00:00`;
  } catch (error) {
    console.error('Error al convertir fecha:', error);
    return '';
  }
}

  // GET
  getReservas(): Observable<ReservaDTO[]> {
    return this.http.get<ReservaDTO[]>(`${this.baseUrl}/reservas`, { withCredentials: true }).pipe(
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

  getEstablecimientos(): Observable<EstablecimientoDTO[]> {
  return this.http.get<EstablecimientoDTO[]>(`${this.baseUrl}/establecimientos`, { withCredentials: true });
}

getHabitaciones(): Observable<HabitacionDTO[]> {
  return this.http.get<HabitacionDTO[]>(`${this.baseUrl}/habitaciones`, { withCredentials: true });
}

  getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(`${this.baseUrl}/usuarios`, { withCredentials: true });
  }

addReserva(reservas: ReservaDTO[]): Observable<any> {
  return this.http.post(`${this.baseUrl}/reservas`, reservas, {
    headers: this.jsonHeaders,
    withCredentials: true
  });
}

  // Métodos adicionales para obtener objetos por ID o DNI
  getPersonaByDni(dni: string): Observable<Persona> {
    return this.http.get<Persona>(`${this.baseUrl}/personas/${dni}`, { withCredentials: true });
  }

 getEstablecimientoById(id: number): Observable<EstablecimientoDTO> {
  return this.http.get<EstablecimientoDTO>(`${this.baseUrl}/establecimientos/${id}`, { withCredentials: true });
}

  getHabitacionById(id: number): Observable<Habitacion> {
    return this.http.get<Habitacion>(`${this.baseUrl}/habitaciones/${id}`, { withCredentials: true });
  }

  private formatDateString(date: string): string {
  if (!date) return '';
  return date.length > 10 ? date.substring(0, 10) : date;
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

 addEstablecimiento(establecimientoDTO: EstablecimientoDTO): Observable<any> {
  return this.http.post(`${this.baseUrl}/establecimientos`, establecimientoDTO, {
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

addHabitacion(habitacionDTO: HabitacionDTO): Observable<any> {
  return this.http.post(`${this.baseUrl}/habitaciones`, habitacionDTO, {
    headers: this.jsonHeaders,
    withCredentials: true
  });
}

 updateReserva(id: number, reserva: Reserva): Observable<any> {
  const dto: ReservaDTO = {
    id,
    personaDni:
      typeof reserva.persona === 'string'
        ? reserva.persona
        : reserva.persona?.dni ?? '',
    establecimientoId:
      typeof reserva.establecimiento === 'number'
        ? reserva.establecimiento
        : reserva.establecimiento?.id ?? 0,
    habitacionId:
      typeof reserva.habitacion === 'number'
        ? reserva.habitacion
        : reserva.habitacion?.id ?? 0,
    fechaEntrada: this.dateToString(this.convertDateToISO(reserva.fechaEntrada)),
    fechaSalida: this.dateToString(this.convertDateToISO(reserva.fechaSalida)),
    motivoEntrada: reserva.motivoEntrada ?? '',
    observaciones: reserva.observaciones ?? ''
  };

  return this.http.put(
    `${this.baseUrl}/reservas/${id}`,
    dto,
    {
      headers: this.jsonHeaders,
      withCredentials: true
    }
  );
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

  updateHabitacion(id: number, habitacionDTO: HabitacionDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/habitaciones/${id}`, habitacionDTO, {
      headers: this.jsonHeaders,
      withCredentials: true
    });
  }

  updateEstablecimiento(id: number, establecimientoDTO: EstablecimientoDTO): Observable<any> {
  return this.http.put(`${this.baseUrl}/establecimientos/${id}`, establecimientoDTO, {
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
  return this.http.get<Habitacion[]>(
    `${this.baseUrl}/habitaciones/disponibles?fechaEntrada=${fechaEntrada}&fechaSalida=${fechaSalida}`,
    { withCredentials: true }
  );
}
}