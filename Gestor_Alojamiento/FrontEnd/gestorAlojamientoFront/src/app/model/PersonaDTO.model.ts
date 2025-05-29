export interface PersonaDTO {
  dni: string;
  nombre: string;
  apellidos: string;
  fechaNacimiento: string; // Usar string para fechas en TS (formato ISO)
  telefono: string;
  email: string;
  reservaIds?: number[]; // Solo presente en respuestas, opcional
}