import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Keyboard } from '@capacitor/keyboard';
import { TextZoom } from '@capacitor/text-zoom';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications'; // Import Push Notifications

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController
  ) {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  // Lifecycle hook to initialize Push Notifications when the page loads
  ionViewWillEnter() {
    this.setupPushNotifications();
  }

  // Handle login logic
  async onLogin() {
    const { username, password } = this.loginForm.value;
    const storedPassword = localStorage.getItem('password') || 'contra';

    localStorage.setItem('username', username);

    if (username === 'ben' && password === storedPassword) {
      this.router.navigate(['/home']);
      Keyboard.hide(); // Hide keyboard after form submission
    } else {
      const alert = await this.alertController.create({
        header: 'Error de validación',
        message: 'Nombre de usuario y/o contraseña incorrectos.',
        buttons: ['OK']
      });
      await alert.present();
      Keyboard.hide(); // Hide keyboard if credentials are incorrect
    }
  }

  // Redirect to password reset page
  goToPasswordReset() {
    this.router.navigate(['/passreset']);
  }

  // Increase text zoom
  async increaseTextZoom() {
    try {
      const result = await TextZoom.get();
      const newZoom = result.value + 0.1; // Increase zoom by 0.1
      await TextZoom.set({ value: newZoom });
    } catch (error) {
      console.error('Error aumentando el zoom:', error);
    }
  }

  // Reset text zoom to default
  async resetTextZoom() {
    try {
      await TextZoom.set({ value: 1 }); // Reset zoom to 100%
    } catch (error) {
      console.error('Error restableciendo el zoom:', error);
    }
  }

  // Dismiss keyboard
  dismissKeyboard() {
    Keyboard.hide();
  }

  // Set up push notifications specific to this page
  private setupPushNotifications() {
    // Listener for receiving notifications
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received on LoginPage:', notification);
      this.showNotificationAlert(notification);
    });
  }

  // Display an alert for the notification
  private async showNotificationAlert(notification: PushNotificationSchema) {
    const alert = await this.alertController.create({
      header: notification.title || 'Notificación',
      message: notification.body || 'Has recibido una nueva notificación.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
