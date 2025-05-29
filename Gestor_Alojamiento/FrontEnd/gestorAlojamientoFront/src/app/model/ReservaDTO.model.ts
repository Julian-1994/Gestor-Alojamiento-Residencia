export interface ReservaDTO {
  id?: number,
  personaDni: string;
  establecimientoId: number;
  habitacionId: number;
  fechaEntrada: string;   // ISO yyyy-MM-ddTHH:mm:ss
  fechaSalida: string;    // ISO yyyy-MM-ddTHH:mm:ss
  motivoEntrada?: string;
  observaciones?: string;
}