import { Component } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { NgIf } from '@angular/common';  // <-- Importa NgIf aquí
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, HttpClientModule, RouterModule, NgIf]
})
export class LoginComponent {
  usuario: string = '';
  contrasenya: string = '';
  error: string = '';
  title: string = 'Gestor de alojamientos';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const body = {
      usuario: this.usuario,
      contrasenya: this.contrasenya
    };

    this.http.post<any>('http://localhost:9020/api/usuarios/login', body, { withCredentials: true }).subscribe({
      next: (data: any) => {
            localStorage.setItem('usuario', JSON.stringify(data));
        if (data.rol === 'ADMIN') {
          this.router.navigate(['/admin']);
        } else if (data.rol === 'USUARIO') {
          this.router.navigate(['/user']);
        } else {
          this.error = 'Rol no reconocido.';
        }
      },
      error: (err: any) => {
        this.error = 'Usuario o contraseña incorrectos.';
        console.error('Error de autenticación:', err);
      }
    });
  }
}