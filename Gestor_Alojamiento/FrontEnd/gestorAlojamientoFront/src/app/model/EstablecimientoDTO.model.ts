export interface EstablecimientoDTO {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  capacidad: number;
  habitacionIds?: number[];
}