import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  credentials = { username: '', password: '' };
  error: string | null = null;
  loading = false;

  constructor(private authService: AuthService, private router: Router) {}
// Ajoutez à votre classe LoginComponent
passwordVisible = false;

togglePasswordVisibility(): void {
  this.passwordVisible = !this.passwordVisible;
  const passwordField = document.getElementById('password') as HTMLInputElement;
  passwordField.type = this.passwordVisible ? 'text' : 'password';
}
  login(): void {
    this.loading = true;
    this.error = null;

    this.authService.login(this.credentials).subscribe({
      next: (res) => {
        this.authService.storeTokens(res.access, res.refresh);
        this.authService.redirectUserByRole();
      },
      error: (err) => {
        this.error = 'Identifiants invalides';
        console.error(err);
        this.loading = false;
      }
    });
  }
}