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
  isSubmitting = false;

  constructor(private auth: AuthService, private router: Router) {}

  toggleMode() {
    this.registering = !this.registering;
    this.errorMessage = '';
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

      this.auth.register(this.email, this.username, this.password).subscribe({
        next: (response) => {
          console.log('Register successful:', response);
          this.isSubmitting = false;
          this.router.navigate(['/']);
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
          this.router.navigate(['/']);
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
