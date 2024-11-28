import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PushNotifications, Token, PushNotificationSchema } from '@capacitor/push-notifications';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  constructor(private router: Router) {
    this.initializePushNotifications();
  }

  // Method for navigating to different pages
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  // Method to initialize push notifications
  initializePushNotifications() {
    // Request permissions
    PushNotifications.requestPermissions().then(permission => {
      if (permission.receive === 'granted') {
        // Register the app with the notification service
        PushNotifications.register();
      } else {
        console.log('Push notification permission not granted');
      }
    });

    // Listener for successful registration and token retrieval
    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push notification registration successful. Token:', token.value);
    });

    // Listener for errors during registration
    PushNotifications.addListener('registrationError', (error) => {
      console.error('Push notification registration failed:', error);
    });

    // Listener for receiving a push notification while the app is in the foreground
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received:', notification);
      // Optionally handle navigation based on the notification's payload
      if (notification.data?.route) {
        this.navigateTo(notification.data.route);
      }
    });

    // Listener for handling notification actions (e.g., clicks)
    PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
      console.log('Notification action performed:', notification);
      if (notification.notification.data?.route) {
        this.navigateTo(notification.notification.data.route);
      }
    });
  }
}
