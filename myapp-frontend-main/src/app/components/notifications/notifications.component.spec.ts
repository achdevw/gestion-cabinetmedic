import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { LucideAngularModule } from 'lucide-angular'; // si tu utilises lucide

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  template: `
    <div class="notifications">
      <h2>Mes notifications</h2>

      <ul *ngIf="notifications.length > 0; else noNotifs">
        <li *ngFor="let notif of notifications">
          <div class="notif-item" [class.unread]="!notif.lu">
            <div class="notif-header">
              <h4>{{ notif.titre }}</h4>
              <button (click)="toggleRead(notif)" title="Marquer comme lu/non lu">
                <lucide-icon
                  [name]="notif.lu ? 'eye' : 'eye-off'"
                  stroke-width="2"
                  size="20"
                  [style.color]="notif.lu ? 'green' : 'gray'">
                </lucide-icon>
              </button>
            </div>
            <p>{{ notif.message }}</p>
            <small>Envoyée le : {{ notif.date_envoyee | date:'short' }}</small>
          </div>
        </li>
      </ul>

      <ng-template #noNotifs>
        <p>Aucune notification reçue.</p>
      </ng-template>
    </div>
  `,
  styles: [`
    .notifications { padding: 1rem; }
    .notif-item {
      border: 1px solid #ccc;
      padding: 0.75rem;
      margin-bottom: 1rem;
      border-left: 4px solid #007bff;
      border-radius: 5px;
    }
    .notif-item.unread {
      background-color: #fdfdfd;
      font-weight: bold;
    }
    .notif-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    button {
      background: transparent;
      border: none;
      cursor: pointer;
    }
  `]
})
export class NotificationsComponent implements OnInit {
  notifications: any[] = [];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.http.get<any[]>('http://localhost:8000/api/notifications/').subscribe({
      next: data => this.notifications = data,
      error: err => console.error('Erreur chargement notifications', err)
    });
  }

  toggleRead(notif: any) {
    const updated = { lu: !notif.lu };
    this.http.patch(`http://localhost:8000/api/notifications/${notif.id}/`, updated).subscribe({
      next: () => notif.lu = updated.lu,
      error: err => console.error('Erreur mise à jour lecture', err)
    });
  }
}
