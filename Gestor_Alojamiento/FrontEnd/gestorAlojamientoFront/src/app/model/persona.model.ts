import { Reserva } from './reserva.model';

export interface Persona {
  dni: string;
  nombre: string;
  apellidos: string;
  fecha_nacimiento: Date;
  telefono: string;
  email: string;
}