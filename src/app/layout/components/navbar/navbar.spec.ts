import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar';
import { AuthService } from '../../../core/services/auth.service';
import { signal } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

/* =======================
   Tipado del estado auth
======================= */
interface AuthState {
  isAuthenticated: boolean;
  username: string | null;
}

/* =======================
   Mock AuthService
======================= */
class AuthServiceMock {
  private _authState = signal<AuthState>({
    isAuthenticated: false,
    username: null
  });

  authState$ = this._authState.asReadonly();

  logout = jasmine.createSpy('logout');

  setAuthState(state: AuthState) {
    this._authState.set(state);
  }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let authService: AuthServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NavbarComponent,
        RouterTestingModule, // ✅ SOLUCIÓN CLAVE
        NoopAnimationsModule
      ],
      providers: [
        { provide: AuthService, useClass: AuthServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService) as unknown as AuthServiceMock;
    fixture.detectChanges();
  });

  /* =======================
     Creación
  ======================= */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* =======================
     Estado no autenticado
  ======================= */
  it('should reflect unauthenticated state', () => {
    expect(component.isAuthenticated()).toBeFalse();
    expect(component.username()).toBeNull();
  });

  /* =======================
     Estado autenticado
  ======================= */
  it('should reflect authenticated state with username', () => {
    authService.setAuthState({
      isAuthenticated: true,
      username: 'Carlos'
    });

    fixture.detectChanges();

    expect(component.isAuthenticated()).toBeTrue();
    expect(component.username()).toBe('Carlos');
  });

  /* =======================
     logout()
  ======================= */
  it('should call authService.logout when logout is triggered', () => {
    component.logout();

    expect(authService.logout).toHaveBeenCalled();
  });

  /* =======================
     Reactividad de computed
  ======================= */
  it('should update computed values when authState changes', () => {
    authService.setAuthState({
      isAuthenticated: true,
      username: 'Admin'
    });

    expect(component.isAuthenticated()).toBeTrue();
    expect(component.username()).toBe('Admin');

    authService.setAuthState({
      isAuthenticated: false,
      username: null
    });

    expect(component.isAuthenticated()).toBeFalse();
    expect(component.username()).toBeNull();
  });
});
