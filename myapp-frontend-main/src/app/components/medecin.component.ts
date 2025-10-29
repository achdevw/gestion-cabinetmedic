import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

interface Appointment {
  id: number;
  patient_name: string;
  date_heure: string;
  motif: string;
  statut: string;
}

@Component({
  selector: 'app-doctor-appointments',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './medecin.component.html',
  styleUrls: ['./medecin.component.css']
})
export class MedecinComponent implements OnInit {
  appointments: Appointment[] = [];
  medecinId: number | null = null;
  isLoading = false;
  error: string | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const storedId = localStorage.getItem('user_id');
    if (storedId) {
      this.medecinId = +storedId;
      this.loadAppointments();
    } else {
      this.error = 'Aucun identifiant de médecin trouvé.';
    }
  }

  loadAppointments(): void {
    if (!this.medecinId) return;
    this.isLoading = true;
    this.error = null;
    this.http.get<Appointment[]>(`http://localhost:8000/api/appointments/?medecin_id=${this.medecinId}`).subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des rendez-vous.';
        this.isLoading = false;
        console.error('Erreur chargement rendez-vous', err);
      }
    });
  }

  cancelAppointment(id: number): void {
    this.http.patch(`http://localhost:8000/api/appointments/${id}`, { statut: 'annulé' }).subscribe({
      next: () => {
        const appt = this.appointments.find(a => a.id === id);
        if (appt) appt.statut = 'annulé';
      },
      error: (err) => {
        this.error = 'Erreur lors de l\'annulation du rendez-vous.';
        console.error('Erreur annulation rendez-vous', err);
      }
    });
  }

  viewDetails(id: number): void {
    // Implement navigation or modal for details
    console.log(`Voir détails pour rendez-vous ID: ${id}`);
  }

  trackById(index: number, rdv: Appointment): number {
    return rdv.id;
  }
}