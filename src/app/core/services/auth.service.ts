import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from './api.service';
import { LoginRequest, LoginResponse, AuthState, RegisterRequest } from '../../shared/models/auth';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiService = inject(ApiService);
  private router = inject(Router);

  // Usamos signals para el estado de autenticación
  private authState = signal<AuthState>({
    isAuthenticated: false,
    username: null,
    token: null
  });

  // Exponemos la señal como de solo lectura
  readonly authState$ = this.authState.asReadonly();

  constructor() {
    // Verificar si hay token guardado al iniciar
    const token = localStorage.getItem('token');
    const username = localStorage.getItem('username');

    if (token && username) {
      this.authState.set({
        isAuthenticated: true,
        username,
        token
      });
    }
  }

  login(credentials: LoginRequest) {
    return this.apiService.post<LoginResponse>('auth/login', credentials).pipe(
      tap(response => {
        // Guardar en localStorage
        localStorage.setItem('token', response.token);
        localStorage.setItem('username', response.username);

        // Actualizar estado
        this.authState.set({
          isAuthenticated: true,
          username: response.username,
          token: response.token
        });
      })
    );
  }

  // auth.service.ts - Agregar este método:
  register(credentials: RegisterRequest) {
    return this.apiService.post<void>('auth/register', credentials);
  }

  logout() {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('username');

    // Resetear estado
    this.authState.set({
      isAuthenticated: false,
      username: null,
      token: null
    });

    // Redirigir al login
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return this.authState().token;
  }

  isAuthenticated(): boolean {
    return this.authState().isAuthenticated;
  }

  getUsername(): string | null {
    return this.authState().username;
  }
}
