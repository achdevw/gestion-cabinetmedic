import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Notification {
  id: number;
  titre: string;
  message: string;
  lu: boolean;
  date_envoyee: string;
  user: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:8000/api/notifications/';

  constructor(private http: HttpClient) {}

  getUserNotifications(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.apiUrl}?user=${userId}`);
  }

  markAsRead(id: number): Observable<any> {
    return this.http.patch(`${this.apiUrl}${id}/`, { lu: true });
  }
}
