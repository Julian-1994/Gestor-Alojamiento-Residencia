import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// para proteger las rutas de administrador

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const usuario = JSON.parse(localStorage.getItem('usuario') || 'null');
    if (usuario && usuario.rol === 'ADMIN') {
      return true;
    }
    alert('Acceso denegado. Solo los administradores pueden acceder a esta sección.');
    this.router.navigate(['/login']);
    return false;
  }
}