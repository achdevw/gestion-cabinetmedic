import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DoctorService {
  private apiUrl = 'http://localhost:8000/api'; // adapte si besoin

  constructor(private http: HttpClient) {}

  // Obtenir la liste des médecins disponibles
  getDoctors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/doctors/`);
  }

  // Obtenir un médecin spécifique
  getDoctorById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/doctors/${id}/`);
  }

  // (Optionnel) Mettre à jour un médecin (si rôle admin)
  updateDoctor(id: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/doctors/${id}/`, data);
  }

  // (Optionnel) Supprimer un médecin
  deleteDoctor(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/doctors/${id}/`);
  }

  // (Optionnel) Créer un nouveau médecin (admin)
  createDoctor(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/doctors/`, data);
  }
}
