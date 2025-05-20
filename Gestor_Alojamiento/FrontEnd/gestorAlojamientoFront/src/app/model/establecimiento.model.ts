import { Habitacion } from './habitacion.model';
import { Reserva } from './reserva.model';

export interface Establecimiento {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  capacidad: number;
  habitaciones?: Habitacion[]; // opcional si no se usa en el frontend
  reservas?: Reserva[];        // opcional si no se usa directamente
}