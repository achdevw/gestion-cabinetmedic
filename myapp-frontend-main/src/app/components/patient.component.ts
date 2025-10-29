import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-patient-appointment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  doctors: any[] = [];
  appointments: any[] = [];
  patientId: number = 0;
  appointmentData: { [key: number]: {
date_heure: any; date: string; motif: string 
} } = {};

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getCurrentPatientId();
    this.loadDoctors();
    this.loadAppointments();
  }

  getCurrentPatientId() {
    const token = localStorage.getItem('access_token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.patientId = payload.user_id;
    }
  }

  loadDoctors() {
    this.http.get<any[]>('http://localhost:8000/api/medecins/').subscribe({
      next: data => {
        this.doctors = data || [];
        for (let doc of this.doctors) {
          this.appointmentData[doc.id] = { date_heure: null, date: '', motif: '' };
        }
      },
      error: err => console.error('Erreur chargement médecins', err)
    });
  }

  loadAppointments() {
    this.http.get<any[]>(`http://localhost:8000/api/appointments/?patient=${this.patientId}`).subscribe({
      next: data => this.appointments = data || [],
      error: err => console.error('Erreur chargement rendez-vous', err)
    });
  }

  bookAppointment(medecinId: number) {
    const selected = this.appointmentData[medecinId];
    if (!selected.date || !selected.motif) {
      alert('Date et motif obligatoires.');
      return;
    }

    const body = {
      patient: this.patientId,
      medecin: medecinId,
      date_heure: new Date(selected.date).toISOString(),
      motif: selected.motif
    };

    this.http.post('http://localhost:8000/api/appointments/', body).subscribe({
      next: () => {
        alert('Rendez-vous enregistré.');
        this.loadAppointments();
        this.appointmentData[medecinId] = { date_heure: null, date: '', motif: '' };
      },
      error: err => console.error('Erreur réservation', err)
    });
  }

  cancelAppointment(id: number) {
    if (confirm('Annuler ce rendez-vous ?')) {
      this.http.delete(`http://localhost:8000/api/appointments/${id}/`).subscribe({
        next: () => {
          alert('Rendez-vous annulé.');
          this.loadAppointments();
        },
        error: err => console.error('Erreur annulation', err)
      });
    }
  }
  trackByDoctorId(index: number, doctor: any): number {
  return doctor.id;
}

trackByAppointmentId(index: number, appointment: any): number {
  return appointment.id;
}

}