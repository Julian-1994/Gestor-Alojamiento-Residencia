import { Persona } from './persona.model';
import { Establecimiento } from './establecimiento.model';
import { Habitacion } from './habitacion.model';

export interface Reserva {
  id: number;
  persona_dni: Persona;
  establecimiento_id: Establecimiento;
  habitacion_id: Habitacion;
  fecha_entrada: Date;
  fecha_salida: Date;
  motivo_entrada: string;
  observaciones: string;
}