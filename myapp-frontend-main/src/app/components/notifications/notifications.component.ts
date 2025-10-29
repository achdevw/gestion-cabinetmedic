import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // 👈 important

import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {
  notifications: Notification[] = [];
  userId = Number(localStorage.getItem('user_id')); // Assure-toi de stocker ça à la connexion

  constructor(private notificationService: NotificationService) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications() {
    this.notificationService.getUserNotifications(this.userId).subscribe(data => {
      this.notifications = data.sort((a, b) => new Date(b.date_envoyee).getTime() - new Date(a.date_envoyee).getTime());
    });
  }

  markAsRead(notif: Notification) {
    if (!notif.lu) {
      this.notificationService.markAsRead(notif.id).subscribe(() => notif.lu = true);
    }
  }
}
