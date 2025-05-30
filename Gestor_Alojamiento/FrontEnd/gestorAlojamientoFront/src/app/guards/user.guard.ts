import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// Para proteger las rutas de usuario

@Injectable({ providedIn: 'root' })
export class UserGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (usuario && usuario.rol === 'USUARIO') {
      return true;
    }
    alert('Acceso denegado. Solo los usuarios pueden acceder a esta sección.');
    this.router.navigate(['/login']);
    return false;
  }
}