import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-container">
      <h2>{{ userId ? 'Modifier' : 'Créer' }} un utilisateur</h2>
      <form (ngSubmit)="onSubmit()">
        <label>Nom d'utilisateur</label>
        <input [(ngModel)]="user.username" name="username" required />

        <label>Mot de passe</label>
        <input [(ngModel)]="user.password" name="password" [required]="!userId" type="password" />

        <label>Rôle</label>
        <select [(ngModel)]="user.role" name="role" required>
          <option value="admin">Admin</option>
          <option value="medecin">Médecin</option>
          <option value="patient">Patient</option>
        </select>

        <button type="submit">{{ userId ? 'Mettre à jour' : 'Créer' }}</button>
        <button type="button" (click)="cancel()">Annuler</button>
      </form>
    </div>
  `,
  styles: [`
    .form-container { max-width: 500px; margin: auto; padding: 1rem; }
    input, select, button { display: block; width: 100%; margin: 0.5rem 0; padding: 0.5rem; }
  `]
})
export class UserFormComponent implements OnInit {
  @Input() userId: number | null = null;
  user = { username: '', password: '', role: 'patient' };

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    if (this.userId) {
      this.http.get<any>(`http://localhost:8000/api/users/${this.userId}/`).subscribe({
        next: u => {
          this.user.username = u.username;
          this.user.role = u.role;
        }
      });
    }
  }

  onSubmit() {
    if (this.userId) {
      this.http.put(`http://localhost:8000/api/users/${this.userId}/`, this.user).subscribe(() => {
        this.router.navigate(['/admin']);
      });
    } else {
      this.http.post(`http://localhost:8000/api/users/`, this.user).subscribe(() => {
        this.router.navigate(['/admin']);
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin']);
  }
}
