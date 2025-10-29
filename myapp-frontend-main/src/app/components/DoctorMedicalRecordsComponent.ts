import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-doctor-records',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div>
      <h3>Dossiers médicaux des patients</h3>
      <ul *ngIf="records.length; else noRecords">
        <li *ngFor="let rec of records">
          {{ rec.patient_name }} - {{ rec.date }}<br />
          <strong>Notes:</strong> {{ rec.notes }}<br />
          <strong>Ordonnance:</strong> {{ rec.ordonnance }}
        </li>
      </ul>
      <ng-template #noRecords><p>Aucun dossier trouvé.</p></ng-template>

      <h3>Ajouter un dossier médical</h3>
      <form (ngSubmit)="addRecord()">
        <input [(ngModel)]="recordForm.patient_id" name="patient" placeholder="ID patient" required />
        <textarea [(ngModel)]="recordForm.notes" name="notes" placeholder="Notes médicales" required></textarea>
        <textarea [(ngModel)]="recordForm.ordonnance" name="ordonnance" placeholder="Ordonnance"></textarea>
        <button type="submit">Enregistrer</button>
      </form>
    </div>
  `
})
export class DoctorMedicalRecordsComponent implements OnInit {
  records: any[] = [];
  recordForm = { patient_id: '', notes: '', ordonnance: '' };
  medecinId = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      this.medecinId = +storedId;
      this.loadRecords();
    }
  }

  loadRecords() {
    this.http.get<any[]>(`http://localhost:8000/api/medical-records/?medecin_id=${this.medecinId}`).subscribe({
      next: data => this.records = data,
      error: err => console.error('Erreur chargement dossiers médicaux', err)
    });
  }

  addRecord() {
    const payload = { ...this.recordForm, medecin_id: this.medecinId };
    this.http.post('http://localhost:8000/api/medical-records/', payload).subscribe({
      next: () => {
        this.recordForm = { patient_id: '', notes: '', ordonnance: '' };
        this.loadRecords();
      },
      error: err => console.error('Erreur ajout dossier médical', err)
    });
  }
}
