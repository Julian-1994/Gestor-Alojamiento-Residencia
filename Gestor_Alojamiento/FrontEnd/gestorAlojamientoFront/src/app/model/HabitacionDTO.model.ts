import { EstadoHabitacion } from "./habitacion.model";

export interface HabitacionDTO {
  id: number;
  numero: string;
  tipo: string;
  estado: EstadoHabitacion;         // coincide con tu enum EstadoHabitacion en Java
  establecimientoId: number;
}