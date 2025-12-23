import { CommonModule } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
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

  authState = this.authService.authState$;

  isAuthenticated = computed(() => this.authState().isAuthenticated);
  username = computed(() => this.authState().username);

  logout() {
    this.authService.logout();
  }
}
