import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';

@Component({
  selector: 'app-password-reset',
  templateUrl: './passreset.page.html',
  styleUrls: ['./passreset.page.scss'],
})
export class PasswordResetPage {
  passwordResetForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private alertController: AlertController
  ) {
    this.passwordResetForm = this.formBuilder.group({
      username: ['', [Validators.required]],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
    });

    this.setupPushNotifications(); // Initialize push notifications
  }

  async onResetPassword() {
    const { username, newPassword } = this.passwordResetForm.value;

    if (this.passwordResetForm.valid) {
      if (username === localStorage.getItem('username')) {
        localStorage.setItem('password', newPassword);

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'La contraseña ha sido actualizada.',
          buttons: ['OK'],
        });
        await alert.present();
        this.router.navigate(['/login']);
      } else {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Nombre de usuario no encontrado.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    } else {
      const alert = await this.alertController.create({
        header: 'Error',
        message: 'Por favor, completa todos los campos correctamente. La contraseña debe tener al menos 8 caracteres.',
        buttons: ['OK'],
      });
      await alert.present();
    }
  }

  // Set up push notifications for the PasswordResetPage
  private setupPushNotifications() {
    // Listener for when a notification is received
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received on PasswordResetPage:', notification);
      this.showNotificationAlert(notification);
    });
  }

  // Show an alert with notification details
  private async showNotificationAlert(notification: PushNotificationSchema) {
    const alert = await this.alertController.create({
      header: notification.title || 'Notificación',
      message: notification.body || 'Has recibido una nueva notificación.',
      buttons: ['OK'],
    });
    await alert.present();
  }
}
