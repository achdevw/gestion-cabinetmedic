import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private apiUrl = 'http://localhost:8000/api'; // adapte à ton backend

  constructor(private http: HttpClient) {}

  getMyAppointments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/appointments/mine/`);
  }

  bookAppointment(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/appointments/`, data);
  }

  cancelAppointment(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/appointments/${id}/`);
  }
}
