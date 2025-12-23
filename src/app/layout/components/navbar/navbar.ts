import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonModule, CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
   private authService = inject(AuthService);

  // Exponer el estado de autenticación
  get isAuthenticated() {
    return this.authService.isAuthenticated();
  }

  get username() {
    return this.authService.getUsername();
  }

  logout() {
    this.authService.logout();
  }
}
