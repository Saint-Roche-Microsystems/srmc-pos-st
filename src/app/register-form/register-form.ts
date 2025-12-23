import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../core/services/auth.service';
import { RegisterRequest } from '../shared/models/auth';


@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.css',
})
export class RegisterForm {

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  registerForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor() {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator for password matching
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ mismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    const registerData: RegisterRequest = {
      username: this.registerForm.value.username,
      password: this.registerForm.value.password
    };

    this.authService.register(registerData).subscribe({
      next: () => {
        this.successMessage = 'Account created successfully! Redirecting to login...';

        setTimeout(() => {
          this.isLoading = false; // ✅ mover aquí
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (error) => {
        this.isLoading = false;

        if (error.status === 400) {
          this.errorMessage = 'Username already exists. Please choose another one.';
        } else if (error.status === 0) {
          this.errorMessage = 'Cannot connect to server. Please try again later.';
        } else {
          this.errorMessage = 'An error occurred during registration. Please try again.';
        }
      }
    });
  }
}
