import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], // 👈 Ajoute RouterModule ici
  template: `
    <nav class="admin-nav" role="navigation" aria-label="Navigation administrateur">
      <div class="nav-container">
        <h1 class="nav-title">Cabinet Médical – Admin</h1>
        <ul class="nav-links">
          <li><a routerLink="/admin" routerLinkActive="active">Dashboard</a></li>
          <li><a routerLink="/admin/patients" routerLinkActive="active">Patients</a></li>
          <li><a routerLink="/appointments" routerLinkActive="active">Rendez-vous</a></li>
          <li><a routerLink="/medicalrecords" routerLinkActive="active">Rapports</a></li>
          <li><a routerLink="/admin/settings" routerLinkActive="active">Paramètres</a></li>
          <li><a routerLink="/login" class="logout" routerLinkActive="active">Déconnexion</a></li>
        </ul>
      </div>
    </nav>

    <div class="medical-dashboard" role="main" aria-labelledby="dashboard-title">
      <h2 id="dashboard-title" class="medical-title">Tableau de Bord - Cabinet Médical</h2>

      <section class="stats-cards" aria-label="Statistiques du cabinet médical">
        <div class="card" role="region" aria-label="Nombre de patients">
          <span class="card-icon">👤</span>
          Patients : <strong>{{ totalUsers }}</strong>
        </div>
        <div class="card" role="region" aria-label="Nombre de dossiers médicaux">
          <span class="card-icon">📋</span>
          Dossiers Médicaux : <strong>{{ totalRecords  }}</strong>
        </div>
        <div class="card" role="region" aria-label="Nombre de rendez-vous">
          <span class="card-icon">📅</span>
          Rendez-vous : <strong>{{ totalAppointments }}</strong>
        </div>
      </section>

      <section class="patient-status" aria-label="Statut des patients">
        <h3>Statut des Patients</h3>
        <div class="status-grid">
          <div class="status-card" *ngFor="let status of ['En attente', 'Consultation', 'Terminé']">
            <span class="status-icon">{{ status === 'En attente' ? '⏳' : status === 'Consultation' ? '🩺' : '✅' }}</span>
            <p>{{ status }}: <strong>0</strong></p>
          </div>
        </div>
      </section>

      <form class="filter-form" role="search" (ngSubmit)="applyFilter()">
        <div class="form-group">
          <label for="search-input" class="visually-hidden">Rechercher par nom de patient</label>
          <input 
            id="search-input" 
            type="text" 
            placeholder="Rechercher par nom de patient" 
            [(ngModel)]="searchTerm" 
            (input)="applyFilter()"
            name="searchTerm"
            aria-describedby="search-error"
          />
          <div id="search-error" class="error-message" *ngIf="searchTerm.length > 0 && filteredUsers.length === 0">
            Aucun patient trouvé pour "{{ searchTerm }}"
          </div>
        </div>
        
        <div class="form-group">
          <label for="role-select" class="visually-hidden">Filtrer par rôle</label>
          <select 
            id="role-select"
            [(ngModel)]="selectedRole" 
            (change)="applyFilter()"
            name="selectedRole"
            aria-label="Filtrer par rôle"
          >
            <option value="">Tous les rôles</option>
            <option value="admin">Admin</option>
            <option value="medecin">Médecin</option>
            <option value="patient">Patient</option>
          </select>
        </div>
      </form>

      <section aria-labelledby="users-title">
        <h3 id="users-title">Liste des Utilisateurs</h3>
        
        <div class="loading" *ngIf="!users.length && !filteredUsers.length" role="alert" aria-live="polite">
          Chargement des utilisateurs...
        </div>

        <table *ngIf="filteredUsers.length > 0; else noUsers" role="grid" aria-describedby="users-title">
          <thead>
            <tr>
              <th scope="col">ID Patient</th>
              <th scope="col">Nom du Patient</th>
              <th scope="col">Rôle</th>
              <th scope="col">Statut</th>
              <th scope="col">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let user of filteredUsers; trackBy: trackByUserId">
              <td>{{ user.id }}</td>
              <td>{{ user.username }}</td>
              <td>{{ user.role }}</td>
              <td>{{ user.is_active ? 'Actif' : 'Inactif' }}</td>
              <td>
                <button 
                  type="button"
                  (click)="toggleActivation(user)"
                  [attr.aria-label]="user.is_active ? 'Désactiver le patient ' + user.username : 'Activer le patient ' + user.username"
                >
                  {{ user.is_active ? 'Désactiver' : 'Activer' }}
                </button>
                <button 
                  type="button"
                  (click)="deleteUser(user.id)"
                  [attr.aria-label]="'Supprimer le patient ' + user.username"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <ng-template #noUsers>
          <p role="alert">Aucun utilisateur trouvé.</p>
        </ng-template>
      </section>

      <section class="appointments-reminder" aria-label="Rappels de rendez-vous">
        <h3>Rappels de Rendez-vous</h3>
        <p *ngIf="totalAppointments > 0">Vous avez {{ totalAppointments }} rendez-vous aujourd'hui à 12:42 AM +01.</p>
        <p *ngIf="totalAppointments === 0">Aucun rendez-vous prévu aujourd'hui.</p>
      </section>
    </div>
  `,
  styles: [`
    .admin-nav {
      background-color: #2d6a4f;
      padding: 1rem 2rem;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      position: sticky;
      top: 0;
      z-index: 1000;
    }

    .nav-container {
      max-width: 1200px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .nav-title {
      color: #ffffff;
      font-size: 1.5rem;
      font-weight: 600;
      margin: 0;
    }

    .nav-links {
      list-style: none;
      display: flex;
      gap: 1.5rem;
      margin: 0;
      padding: 0;
    }

    .nav-links li {
      margin: 0;
    }

    .nav-links a {
      color: #ffffff;
      text-decoration: none;
      font-weight: 500;
      padding: 0.5rem 1rem;
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }

    .nav-links a:hover,
    .nav-links a.active {
      background-color: #4caf50;
      color: #ffffff;
    }

    .logout {
      background-color: #d32f2f;
    }

    .logout:hover {
      background-color: #c62828;
    }

    .medical-dashboard {
      padding: 2rem;
      max-width: 1200px;
      margin: auto;
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      background-color: #f0f4f8;
      color: #1a1a1a;
      margin-top: 60px; /* Offset for the fixed nav */
    }

    .medical-title {
      color: #2d6a4f;
      margin-bottom: 1.5rem;
      font-weight: 700;
      font-size: 2.5rem;
      border-bottom: 4px solid #4caf50;
      padding-bottom: 0.5rem;
    }

    .stats-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }

    .card {
      background: linear-gradient(145deg, #e8f5e9, #ffffff);
      padding: 1.5rem;
      border-radius: 12px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
      border-left: 6px solid #4caf50;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
      display: flex;
      align-items: center;
      gap: 1rem;
    }

    .card:hover {
      transform: translateY(-3px);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }

    .card strong {
      font-size: 1.5rem;
      color: #2d6a4f;
      margin-left: 0.5rem;
    }

    .card-icon {
      font-size: 1.5rem;
    }

    .patient-status {
      margin-bottom: 2rem;
    }

    .status-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
    }

    .status-card {
      background: #ffffff;
      padding: 1rem;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      text-align: center;
    }

    .status-icon {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }

    .filter-form {
      display: flex;
      gap: 1rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }

    .form-group {
      position: relative;
      flex: 1 1 300px;
    }

    input, select {
      padding: 0.75rem 1rem;
      border: 2px solid #c8e6c9;
      border-radius: 8px;
      font-size: 1rem;
      width: 100%;
      transition: all 0.2s ease;
      background-color: #ffffff;
    }

    input:focus, select:focus {
      border-color: #4caf50;
      box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.15);
      outline: none;
    }

    .error-message {
      color: #d32f2f;
      font-size: 0.875rem;
      margin-top: 0.5rem;
      position: absolute;
      bottom: -1.75rem;
    }

    .loading {
      text-align: center;
      padding: 2rem;
      color: #757575;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin: 2rem 0;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      margin: 1.5rem 0;
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    }

    th {
      background-color: #4caf50;
      color: white;
      font-weight: 600;
      padding: 1rem;
      text-align: left;
    }

    td {
      padding: 1rem;
      border-bottom: 1px solid #e0f2e9;
      color: #455a64;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover td {
      background-color: #e8f5e9;
    }

    button {
      padding: 0.5rem 1rem;
      margin: 0 0.25rem;
      border: none;
      border-radius: 6px;
      font-weight: 500;
      letter-spacing: 0.025em;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }

    button:first-of-type {
      background-color: #4caf50;
      color: white;
    }

    button:first-of-type:hover {
      background-color: #45a049;
    }

    button:last-of-type {
      background-color: #d32f2f;
      color: white;
    }

    button:last-of-type:hover {
      background-color: #c62828;
    }

    p {
      text-align: center;
      padding: 1.5rem;
      color: #757575;
      background-color: #f5f5f5;
      border-radius: 8px;
      margin: 1.5rem 0;
    }

    .appointments-reminder {
      margin-top: 2rem;
      padding: 1.5rem;
      background-color: #ffffff;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }

    .visually-hidden {
      position: absolute;
      width: 1px;
      height: 1px;
      padding: 0;
      margin: -1px;
      overflow: hidden;
      clip: rect(0, 0, 0, 0);
      border: 0;
    }

    @media (max-width: 768px) {
      .admin-nav {
        padding: 1rem;
      }

      .nav-container {
        flex-direction: column;
        align-items: flex-start;
      }

      .nav-links {
        flex-direction: column;
        width: 100%;
        margin-top: 1rem;
      }

      .nav-links li {
        width: 100%;
      }

      .nav-links a {
        padding: 0.75rem 1rem;
        width: 100%;
        box-sizing: border-box;
      }

      .medical-dashboard {
        padding: 1rem;
        margin-top: 100px; /* Increased for mobile nav */
      }
      
      .filter-form {
        flex-direction: column;
      }
      
      .form-group {
        width: 100%;
      }
      
      table {
        display: block;
        overflow-x: auto;
      }
    }
  `]
})
export class AdminComponent implements OnInit {
  users: any[] = [];
  filteredUsers: any[] = [];
  totalUsers = 0;
  totalAppointments = 0;
  totalRecords = 0;
  searchTerm = '';
  selectedRole = '';
  currentUserRole = 'admin'; // À adapter selon ta logique d'authentification

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
    this.fetchStatistics();
  }

  fetchUsers(): void {
    this.http.get<any[]>(`${environment.apiBaseUrl}/users/`).subscribe((data) => {
      this.users = data;
      this.applyFilter();
      this.totalUsers = data.length;
    });
  }

  applyFilter(): void {
    this.filteredUsers = this.users.filter(user => {
      const matchesSearch = this.searchTerm === '' || user.username.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesRole = this.selectedRole === '' || user.role === this.selectedRole;
      return matchesSearch && matchesRole;
    });
  }

  toggleActivation(user: any): void {
    const updatedStatus = !user.is_active;

    this.http.patch(`${environment.apiBaseUrl}/users/${user.id}/`, {
      is_active: updatedStatus
    }).subscribe({
      next: () => {
        user.is_active = updatedStatus;
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut de l’utilisateur :', err);
        alert('Échec de la mise à jour du statut.');
      }
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      this.http.delete(`${environment.apiBaseUrl}/users/${userId}/`).subscribe({
        next: () => {
          this.users = this.users.filter(u => u.id !== userId);
          this.applyFilter();
        },
        error: (err) => {
          console.error('Erreur lors de la suppression :', err);
          alert('Échec de la suppression de l’utilisateur.');
        }
      });
    }
  }

  trackByUserId(index: number, user: any): number {
    return user.id;
  }

  fetchStatistics(): void {
  this.http.get<any>(`${environment.apiBaseUrl}/admin/statistics/`).subscribe(stats => {
    this.totalUsers = stats.total_users;
    this.totalAppointments = stats.total_appointments;
    this.totalRecords = stats.total_records;
  });
}

}
