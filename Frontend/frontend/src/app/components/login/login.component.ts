import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule]
})
export class LoginComponent {
  emailOrUsername = '';
  password = '';
  registering = false;
  email = ''; 
  username = '';
  errorMessage = '';
  successMessage = '';
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  toggleMode() {
    this.registering = !this.registering;
    this.errorMessage = '';
    this.successMessage = '';
    this.clearForm();
  }

  clearForm() {
    this.email = '';
    this.username = '';
    this.emailOrUsername = '';
    this.password = '';
  }

  submit() {
    this.errorMessage = '';
    this.successMessage = '';
    this.isSubmitting = true;
    
    console.log('Submitting form:', { 
      registering: this.registering, 
      email: this.email, 
      username: this.username, 
      emailOrUsername: this.emailOrUsername 
    });
    
    if (this.registering) {
      // Register
      if (!this.email || !this.username || !this.password) {
        this.errorMessage = 'Please fill in all required fields';
        this.isSubmitting = false;
        return;
      }

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.email)) {
        this.errorMessage = 'Please enter a valid email address';
        this.isSubmitting = false;
        return;
      }

      // Validate password length
      if (this.password.length < 6) {
        this.errorMessage = 'Password must be at least 6 characters long';
        this.isSubmitting = false;
        return;
      }

      // Validate username length
      if (this.username.length < 3) {
        this.errorMessage = 'Username must be at least 3 characters long';
        this.isSubmitting = false;
        return;
      }

      this.auth.register(this.email, this.username, this.password).subscribe({
        next: (response) => {
          console.log('Register successful:', response);
          this.isSubmitting = false;
          this.successMessage = 'Account created successfully! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (error) => {
          console.error('Register error:', error);
          this.errorMessage = error.error?.message || 'Registration failed. Please try again.';
          this.isSubmitting = false;
        }
      });
    } else {
      // Login
      if (!this.emailOrUsername || !this.password) {
        this.errorMessage = 'Please enter your credentials';
        this.isSubmitting = false;
        return;
      }

      this.auth.login(this.emailOrUsername, this.password).subscribe({
        next: (response) => {
          console.log('Login successful:', response);
          this.isSubmitting = false;
          this.successMessage = 'Login successful! Redirecting...';
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 1500);
        },
        error: (error) => {
          console.error('Login error:', error);
          this.errorMessage = error.error?.message || 'Login failed. Please check your credentials.';
          this.isSubmitting = false;
        }
      });
    }
  }
}
