export interface HabitacionDTO {
  id: number;
  numero: string;
  tipo: string;
  estado: string;         // coincide con tu enum EstadoHabitacion en Java
  establecimientoId: number;
}