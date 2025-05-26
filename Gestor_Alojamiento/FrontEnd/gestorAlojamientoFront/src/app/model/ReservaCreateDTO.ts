interface ReservaCreateDTO {
  persona: { dni: string };
  establecimiento: { id: number };
  habitacion: { id: number };
  fechaEntrada: string;
  fechaSalida: string;
  motivoEntrada: string;
  observaciones: string;
}