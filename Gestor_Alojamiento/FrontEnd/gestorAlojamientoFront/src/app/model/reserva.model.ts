import { Persona } from './persona.model';
import { Establecimiento } from './establecimiento.model';
import { Habitacion } from './habitacion.model';

export interface Reserva {
  id?: number;
  persona?: Persona;
  establecimiento: Establecimiento;
  habitacion: Habitacion;
  fechaEntrada:string;
  fechaSalida: string;
  motivoEntrada?: string;
  observaciones?: string;
}