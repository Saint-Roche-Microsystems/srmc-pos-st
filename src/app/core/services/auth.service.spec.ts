import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { LoginRequest, LoginResponse, RegisterRequest } from '../../shared/models/auth';

describe('AuthService', () => {
  let service: AuthService;
  let apiServiceSpy: jasmine.SpyObj<ApiService>;
  let routerSpy: jasmine.SpyObj<Router>;

  const mockToken = 'mock-token';
  const mockUsername = 'testuser';

  beforeEach(() => {
    const apiSpy = jasmine.createSpyObj('ApiService', ['post']);
    const routerMock = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: ApiService, useValue: apiSpy },
        { provide: Router, useValue: routerMock },
      ]
    });

    service = TestBed.inject(AuthService);
    apiServiceSpy = TestBed.inject(ApiService) as jasmine.SpyObj<ApiService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should call apiService.post and update auth state', fakeAsync(() => {
      const credentials: LoginRequest = { username: mockUsername, password: 'pass' };
      const response: LoginResponse = { token: mockToken, username: mockUsername };

      apiServiceSpy.post.and.returnValue(of(response));

      service.login(credentials).subscribe(res => {
        expect(res).toEqual(response);
      });

      tick();

      expect(localStorage.getItem('token')).toBe(mockToken);
      expect(localStorage.getItem('username')).toBe(mockUsername);
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getToken()).toBe(mockToken);
      expect(service.getUsername()).toBe(mockUsername);

      expect(apiServiceSpy.post).toHaveBeenCalledWith('auth/login', credentials);
    }));
  });

  describe('register', () => {
    it('should call apiService.post with register endpoint', () => {
      const credentials: RegisterRequest = { username: mockUsername, password: 'pass' };
      apiServiceSpy.post.and.returnValue(of(void 0));

      service.register(credentials).subscribe(res => {
        expect(res).toBeUndefined();
      });

      expect(apiServiceSpy.post).toHaveBeenCalledWith('auth/register', credentials);
    });
  });

  describe('logout', () => {
    it('should clear localStorage, reset auth state and navigate to login', () => {
      // Simular usuario logeado
      localStorage.setItem('token', mockToken);
      localStorage.setItem('username', mockUsername);
      service['authState'].set({ isAuthenticated: true, username: mockUsername, token: mockToken });

      service.logout();

      expect(localStorage.getItem('token')).toBeNull();
      expect(localStorage.getItem('username')).toBeNull();
      expect(service.isAuthenticated()).toBeFalse();
      expect(service.getToken()).toBeNull();
      expect(service.getUsername()).toBeNull();

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('getToken, isAuthenticated, getUsername', () => {
    it('should return correct values from auth state', () => {
      service['authState'].set({ isAuthenticated: true, username: mockUsername, token: mockToken });

      expect(service.getToken()).toBe(mockToken);
      expect(service.isAuthenticated()).toBeTrue();
      expect(service.getUsername()).toBe(mockUsername);
    });
  });
});
