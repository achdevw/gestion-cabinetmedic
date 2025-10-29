import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

type Statut = 'en_attente' | 'confirme' | 'annule';

interface Appointment {
  id: number;
  patient: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
    };
  } | null;
  medecin: {
    id: number;
    user: {
      first_name: string;
      last_name: string;
    };
  } | null;
  date_heure: string;
  statut: Statut;
  motif: string;
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  isLoading = true;
  error: string | null = null;

  readonly API_URL = 'http://localhost:8000/api/';
  readonly token = localStorage.getItem('access_token');

  statutOptions = [
    { value: 'en_attente', label: 'En attente' },
    { value: 'confirme', label: 'Confirmé' },
    { value: 'annule', label: 'Annulé' },
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAppointments();
  }

  getAuthHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    });
  }

  loadAppointments(): void {
    this.http.get<Appointment[]>(`${this.API_URL}appointments/`, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: (data) => {
        this.appointments = data;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Erreur lors du chargement des rendez-vous.';
        console.error(this.error, err);
        this.isLoading = false;
      }
    });
  }

  updateStatut(id: number, newStatut: Statut): void {
    this.http.patch(`${this.API_URL}appointments/${id}/`, { statut: newStatut }, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: () => {
        const appt = this.appointments.find(a => a.id === id);
        if (appt) {
          appt.statut = newStatut;
          this.notifyPatient(appt);
          this.notifyMedecin(appt);
        }
      },
      error: (err) => {
        console.error('Erreur lors de la mise à jour du statut :', err);
      }
    });
  }

  sendNotification(userId: number, message: string): void {
    const payload = { user_id: userId, message: message };
    this.http.post(`${this.API_URL}notifications/send/`, payload, {
      headers: this.getAuthHeaders(),
    }).subscribe({
      next: () => {
        console.log('Notification envoyée avec succès');
      },
      error: (err) => {
        console.error('Erreur lors de l’envoi de la notification :', err);
      }
    });
  }

  notifyPatient(appointment: Appointment): void {
    if (appointment.patient) {
      const nom = `${appointment.patient.user.first_name} ${appointment.patient.user.last_name}`;
      const msg = `Bonjour ${nom}, votre rendez-vous est maintenant "${this.getStatutLabel(appointment.statut)}".`;
      this.sendNotification(appointment.patient.id, msg);
    }
  }

  notifyMedecin(appointment: Appointment): void {
    if (appointment.medecin) {
      const nom = `${appointment.medecin.user.first_name} ${appointment.medecin.user.last_name}`;
      const msg = `Docteur ${nom}, un rendez-vous est maintenant "${this.getStatutLabel(appointment.statut)}".`;
      this.sendNotification(appointment.medecin.id, msg);
    }
  }

  getStatutLabel(value: Statut): string {
    const option = this.statutOptions.find(opt => opt.value === value);
    return option ? option.label : value;
  }

  trackById(index: number, item: Appointment): number {
    return item.id;
  }
}
