import { Reserva } from './reserva.model';

export interface Persona {
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  reservas?: Reserva; // si quisieras incluirlas, pero están ignoradas por @JsonIgnore
}