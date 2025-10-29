import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

interface MedicalRecord {
  id: number;
  date: string;
  notes: string;
  ordonnance: string;
  patient?: { id: number; full_name: string };
  medecin?: { id: number; full_name: string };
}
import { environment } from '../../../environments/environment';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <nav class="medical-nav" role="navigation" aria-label="Medical records navigation">
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


    <div class="medical-records" role="main" aria-labelledby="records-title">
      <h2 id="records-title" class="medical-title">📁 Gestion des Dossiers Médicaux</h2>

      <div class="loading" *ngIf="isLoading" role="alert" aria-live="polite">
        Chargement des dossiers...
      </div>

      <div class="table-wrapper" *ngIf="records.length > 0; else noRecord">
        <table>
          <thead>
            <tr>
              <th scope="col">ID</th>
              <th scope="col">Date</th>
              <th scope="col">Patient</th>
              <th scope="col">Médecin</th>
              <th scope="col">Notes</th>
              <th scope="col">Ordonnance</th>
              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let record of records; trackBy: trackById">
              <td>{{ record.id }}</td>
              <td>{{ record.date | date:'dd/MM/yyyy' }}</td>
            <td>{{ getFullName(record.patient) }}</td>
<td>{{ getFullName(record.medecin) }}</td>

              <td>{{ record.notes }}</td>
              <td>{{ record.ordonnance }}</td>
              <td>
                <button class="btn-delete" (click)="deleteRecord(record.id)" [attr.aria-label]="'Supprimer le dossier ' + record.id">
                  🗑️ Supprimer
                </button>
                <button class="btn-export" (click)="exportToCSV()" aria-label="Exporter les dossiers médicaux">
  📤 Exporter en CSV
</button>

              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <ng-template #noRecord>
        <p class="no-record" role="alert">Aucun dossier médical trouvé.</p>
      </ng-template>
    </div>
  `,
  styles: [`
   /* Global container styling */
/* Global container styling */
.medical-records {
  max-width: 1280px;
  margin: 0 auto;
  padding: 1.5rem;
  font-family: 'Roboto', -apple-system, BlinkMacSystemFont, sans-serif;
  background-color: #f9fafb;
  min-height: 100vh;
}

/* Navigation Bar */
.admin-nav {
  background: linear-gradient(135deg, #38a169 0%, #68d391 100%);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  padding: 1rem 0;
}

.nav-container {
  max-width: 1280px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 1.5rem;
}

.nav-title {
  font-size: 1.5rem;
  font-weight: 500;
  color: white;
  margin: 0;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 1.5rem;
}

.nav-links li a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 400;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background-color 0.2s ease, transform 0.1s ease;
}

.nav-links li a:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.nav-links li a.active {
  background: #2f855a;
  font-weight: 500;
}

.nav-links .logout {
  background: #e53e3e;
}

.nav-links .logout:hover {
  background: #c53030;
}

/* Page Title */
.medical-title {
  font-size: 1.6rem;
  color: #2d3748;
  margin-bottom: 1.5rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border-bottom: 2px solid #38a169;
  padding-bottom: 0.5rem;
}

/* Loading State */
.loading {
  text-align: center;
  padding: 1.5rem;
  color: #718096;
  background: #f7fafc;
  border-radius: 8px;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
}

/* Table Wrapper */
.table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  background: white;
  border: 1px solid #edf2f7;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

/* Table Styling */
table {
  width: 100%;
  border-collapse: collapse;
}

th, td {
  padding: 0.75rem 1rem;
  text-align: left;
  font-size: 0.9rem;
  color: #4a5568;
}

th {
  background: #f7fafc;
  font-weight: 500;
  color: #2d3748;
  border-bottom: 1px solid #e2e8f0;
}

tr {
  transition: background-color 0.2s ease, opacity 0.3s ease;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
}

@keyframes fadeIn {
  to { opacity: 1; }
}

tr:nth-child(even) {
  background: #f9fafb;
}

tr:hover {
  background: #f1f5f9;
}

td[data-label]::before {
  content: attr(data-label);
  display: none;
  font-weight: 500;
  color: #2d3748;
}

/* Action Buttons */
td button {
  margin-right: 0.5rem;
}

.btn-delete, .btn-export {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.65rem 1.25rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  border: none;
  transition: all 0.2s ease;
}

.btn-delete {
  background: #e53e3e;
  color: white;
}

.btn-delete:hover {
  background: #c53030;
  transform: translateY(-1px);
}

.btn-export {
  background: #38a169;
  color: white;
}

.btn-export:hover {
  background: #2f855a;
  transform: translateY(-1px);
}

/* No Records State */
.no-record {
  text-align: center;
  padding: 1.5rem;
  color: #718096;
  background: #f7fafc;
  border-radius: 8px;
  font-size: 0.9rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .medical-records {
    padding: 1rem;
  }

  .nav-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .nav-links {
    flex-direction: column;
    gap: 0.5rem;
    width: 100%;
  }

  .nav-links li {
    width: 100%;
  }

  .nav-links li a {
    display: block;
    padding: 0.75rem;
  }

  .medical-title {
    font-size: 1.4rem;
  }

  table {
    display: block;
  }

  thead {
    display: none;
  }

  tbody, tr {
    display: block;
  }

  tr {
    margin-bottom: 1rem;
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 0.5rem;
  }

  td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    border-bottom: 1px solid #edf2f7;
  }

  td:last-child {
    border-bottom: none;
  }

  td[data-label]::before {
    display: inline;
  }

  .btn-delete, .btn-export {
    width: 100%;
    text-align: center;
    margin-bottom: 0.5rem;
  }
}
  `]
})
export class MedicalRecordsComponent implements OnInit {
  records: MedicalRecord[] = [];
  isLoading: boolean = true;

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords() {
    this.isLoading = true;
    this.http.get<MedicalRecord[]>('http://localhost:8000/api/medical-records/').subscribe({
      next: data => {
        this.records = data || [];
        this.isLoading = false;
      },
      error: err => {
        console.error('Erreur chargement dossiers', err);
        this.isLoading = false;
      }
    });
  }

  deleteRecord(id: number) {
    if (confirm('Supprimer ce dossier médical ?')) {
      this.http.delete(`http://localhost:8000/api/medical-records/${id}/`).subscribe({
        next: () => this.loadRecords(),
        error: err => console.error('Erreur suppression dossier', err)
      });
    }
  }

  trackById(index: number, record: MedicalRecord): number {
    return record.id;
  }
  getFullName(person: any): string {
  return person?.user ? `${person.user.first_name} ${person.user.last_name}` : '—';
}
exportToCSV() {
  const csvRows = [
    ['ID', 'Date', 'Patient', 'Médecin', 'Notes', 'Ordonnance'], // en-têtes
    ...this.records.map(record => [
      record.id,
      new Date(record.date).toLocaleDateString('fr-FR'),
      this.getFullName(record.patient),
      this.getFullName(record.medecin),
      record.notes,
      record.ordonnance
    ])
  ];

  const csvContent = csvRows.map(e => e.map(f => `"${f}"`).join(';')).join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'dossiers_medicaux.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

}