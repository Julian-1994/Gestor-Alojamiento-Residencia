import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuarioService } from '../servicios/usuario.service';
import { Usuario } from '../model/usuario.model';

@Component({
  selector: 'app-usuario',
  templateUrl: "./usuario.component.html",
  styleUrls: ['./usuario.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UsuarioComponent implements OnInit {

  @Input() usuarios: Usuario[] = [];
  @Input() filtroUsuarios: any;
  @Input() usuariosFiltrados: Usuario[] = [];
  @Input() buscandoUsuarios: boolean = false;
  @Input() editandoEntidad: Usuario | null = null;
  @Input() esNuevo: boolean = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {}

  abrirNuevo() {
    this.esNuevo = true;
    this.editandoEntidad = {
      id: 0,
      nombreUsuario: '',
      contrasenya: '',
      rol: '',
      email: ''
    } as Usuario;
  }

  abrirEditar(usuario: Usuario) {
    this.esNuevo = false;
    this.editandoEntidad = { ...usuario };
  }

  guardar() {
    if (this.esNuevo) {
      this.usuarioService.addUsuario(this.editandoEntidad!).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al crear usuario:', err); }
      });
    } else {
      this.usuarioService.updateUsuario(this.editandoEntidad!.id, this.editandoEntidad!).subscribe({
        next: () => { this.postOperacion(); },
        error: (err) => { console.error('Error al actualizar usuario:', err); }
      });
    }
  }

  eliminar(usuario: Usuario) {
    if (!confirm('¿Seguro que deseas eliminar este elemento?')) return;
    this.usuarioService.deleteUsuario(usuario.id).subscribe({
      next: () => { this.postOperacion(); },
      error: (err) => { console.error('Error al eliminar usuario:', err); }
    });
  }

  postOperacion() {
    this.editandoEntidad = null;
    this.esNuevo = false;
  }

  cancelar() {
    this.editandoEntidad = null;
    this.esNuevo = false;
  }

  aplicarFiltroUsuarios() {
    this.buscandoUsuarios = !!(this.filtroUsuarios.nombreUsuario || this.filtroUsuarios.rol || this.filtroUsuarios.email);
    const { nombreUsuario, rol, email } = this.filtroUsuarios;
    this.usuariosFiltrados = this.usuarios.filter(u =>
      (!nombreUsuario || u.nombreUsuario.toLowerCase().includes(nombreUsuario.toLowerCase())) &&
      (!rol || u.rol.toLowerCase().includes(rol.toLowerCase())) &&
      (!email || u.email.toLowerCase().includes(email.toLowerCase()))
    );
  }

  resetearFiltrosUsuarios() {
    this.filtroUsuarios = { nombreUsuario: '', rol: '', email: '' };
    this.buscandoUsuarios = false;
    this.usuariosFiltrados = [...this.usuarios];
  }
}