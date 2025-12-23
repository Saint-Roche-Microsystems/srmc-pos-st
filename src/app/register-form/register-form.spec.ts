import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterForm } from './register-form';
import { AuthService } from '../core/services/auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

describe('RegisterForm', () => {
  let component: RegisterForm;
  let fixture: ComponentFixture<RegisterForm>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let router: Router;

  beforeEach(async () => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['register']);

    await TestBed.configureTestingModule({
      imports: [
        RegisterForm,
        ReactiveFormsModule,
        RouterTestingModule   // ✅ CLAVE
      ],
      providers: [
        { provide: AuthService, useValue: authServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterForm);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    spyOn(router, 'navigate'); // 👈 Espiamos aquí
    fixture.detectChanges();
  });

  // ---------- CREACIÓN ----------
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ---------- FORMULARIO ----------
  it('should initialize form with empty values', () => {
    expect(component.registerForm.value).toEqual({
      username: '',
      password: '',
      confirmPassword: ''
    });
  });

  it('should be invalid when form is empty', () => {
    expect(component.registerForm.invalid).toBeTrue();
  });

  // ---------- VALIDACIÓN PASSWORD ----------
  it('should mark confirmPassword as invalid when passwords do not match', () => {
    component.registerForm.setValue({
      username: 'testuser',
      password: '123456',
      confirmPassword: '654321'
    });

    expect(component.registerForm.hasError('passwordMismatch')).toBeTrue();
    expect(component.registerForm.get('confirmPassword')?.hasError('mismatch')).toBeTrue();
  });

  it('should be valid when passwords match', () => {
    component.registerForm.setValue({
      username: 'testuser',
      password: '123456',
      confirmPassword: '123456'
    });

    expect(component.registerForm.valid).toBeTrue();
  });

  // ---------- SUBMIT INVALID ----------
  it('should not submit if form is invalid', () => {
    component.onSubmit();

    expect(authServiceSpy.register).not.toHaveBeenCalled();
    expect(component.registerForm.touched).toBeTrue();
  });

  // ---------- SUBMIT SUCCESS ----------
  it('should register user and redirect to login on success', fakeAsync(() => {
    authServiceSpy.register.and.returnValue(of(void 0));

    component.registerForm.setValue({
      username: 'testuser',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();

    expect(component.isLoading).toBeTrue();
    expect(authServiceSpy.register).toHaveBeenCalledWith({
      username: 'testuser',
      password: '123456'
    });

    tick(2000);

    expect(component.successMessage).toContain('Account created successfully');
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  }));

  // ---------- ERROR 400 ----------
  it('should show error message when username already exists (400)', () => {
    authServiceSpy.register.and.returnValue(
      throwError(() => ({ status: 400 }))
    );

    component.registerForm.setValue({
      username: 'existingUser',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();

    expect(component.errorMessage)
      .toBe('Username already exists. Please choose another one.');
    expect(component.isLoading).toBeFalse();
  });

  // ---------- ERROR 0 ----------
  it('should show server connection error when status is 0', () => {
    authServiceSpy.register.and.returnValue(
      throwError(() => ({ status: 0 }))
    );

    component.registerForm.setValue({
      username: 'testuser',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();

    expect(component.errorMessage)
      .toBe('Cannot connect to server. Please try again later.');
    expect(component.isLoading).toBeFalse();
  });

  // ---------- ERROR GENERIC ----------
  it('should show generic error for other errors', () => {
    authServiceSpy.register.and.returnValue(
      throwError(() => ({ status: 500 }))
    );

    component.registerForm.setValue({
      username: 'testuser',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();

    expect(component.errorMessage)
      .toBe('An error occurred during registration. Please try again.');
    expect(component.isLoading).toBeFalse();
  });
});
