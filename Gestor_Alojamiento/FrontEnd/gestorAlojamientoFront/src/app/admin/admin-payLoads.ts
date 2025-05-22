import { EstadoHabitacion } from "../model/habitacion.model";

export interface ReservaPayload {
  id?: number; // opcional para creación
  persona: { dni: string };
  habitacion: { id: number };
  establecimiento: { id: number };
  fechaEntrada: string;
  fechaSalida: string;
motivoEntrada?: string;
  observaciones?: string;
}

export interface HabitacionPayload {
  id?: number;
  numero: number;
  tipo: string;
  estado: EstadoHabitacion;
  establecimiento: { id: number };
  reservas: {id: number};
}

export interface PersonaPayload {
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string;
  telefono: string;
  email: string;
  reservas: {id: number};
}

export interface EstablecimientoPayload {
  id?: number;
  nombre: string;
  direccion: string;
  telefono: string;
  capacidad: number;
  habitaciones: {id : number}
  reservas: {id : number}
}

export interface UsuarioPayload {
  id?: number;
  nombreUsuario: string;
  contrasenya: string;
  rol: string
  email: string;
  // agrega campos que use tu API para usuario
}