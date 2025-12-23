import { Component, signal } from '@angular/core';
import { RouterOutlet, Router } from '@angular/router';
import { NavbarComponent } from './layout/components/navbar/navbar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('srmc-pos-st');

  // Rutas donde NO debe mostrarse el navbar
  private publicRoutes = ['/login', '/register'];

  constructor(public router: Router) {}

  // Método para verificar si debe mostrar el navbar
  shouldShowNavbar(): boolean {
    return !this.publicRoutes.includes(this.router.url);
  }
}
