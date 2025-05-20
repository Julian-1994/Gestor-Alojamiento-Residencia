import { Establecimiento } from './establecimiento.model';
import { Reserva } from './reserva.model';

export type EstadoHabitacion = 'DISPONIBLE' | 'OCUPADA';

export interface Habitacion {
  id: number;
  numero: string;
  establecimiento_id: number;
  estado: EstadoHabitacion;
  tipo: string;
}