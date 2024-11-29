import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderService } from '../services/order.service';
import { ToastController } from '@ionic/angular'; 
import { LocalNotifications } from '@capacitor/local-notifications'; // Import Local Notifications

@Component({
  selector: 'app-comida-order',
  templateUrl: './comida-order.page.html',
  styleUrls: ['./comida-order.page.scss'],
})
export class ComidaOrderPage implements OnInit {
  selectedPlatos: any[] = []; 

  constructor(
    private orderService: OrderService,
    private router: Router,
    private toastController: ToastController
  ) { }

  ngOnInit() {
    this.selectedPlatos = this.orderService.getSelectedDishes(); 
  }

  async removePlato(plato: any) {
    this.orderService.removeDish(plato);
    this.selectedPlatos = this.selectedPlatos.filter(p => p !== plato);
  }

  async confirmOrder() {
    const orderNumber = Math.floor(Math.random() * 1000); 
    console.log(`Order Number: ${orderNumber}`, this.selectedPlatos);
    this.orderService.clearOrder(); 

    const toast = await this.toastController.create({
      message: 'Orden realizada, ¡que lo disfrutes!',
      duration: 2000, 
      position: 'bottom',
    });
    toast.present();

    // Enviar la notificación después de 10 segundos
    this.sendLocalNotification('Orden Confirmada', `Tu número de orden es: ${orderNumber}`);

    // Programar la push notification para después de 10 segundos
    setTimeout(() => {
      this.sendPushNotification('Su orden está lista', '¡Puedes retirar tu orden ahora!');
    }, 10000); // 10 segundos

    this.router.navigate(['/home']); 
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  // Método para enviar una notificación local
  private async sendLocalNotification(title: string, message: string) {
    try {
      await LocalNotifications.requestPermissions(); // Solicitar permisos

      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: message,
            id: new Date().getTime(),  // Usar el timestamp como ID único
            schedule: { at: new Date(Date.now() + 1000) }, // Programar para que aparezca en 1 segundo
            sound: 'default',
          }
        ]
      });

      console.log("Notificación local programada con éxito!");

    } catch (error) {
      console.error("Error al programar la notificación local", error);
    }
  }

  // Método para enviar la notificación push después de 10 segundos
  private async sendPushNotification(title: string, message: string) {
    try {
      await LocalNotifications.requestPermissions(); // Asegurarse de que se tienen permisos

      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: message,
            id: new Date().getTime(), // ID único
            schedule: { at: new Date(Date.now() + 10000) }, // Programar para 10 segundos
            sound: 'default',
          }
        ]
      });

      console.log("Notificación push programada con éxito después de 10 segundos!");

    } catch (error) {
      console.error("Error al programar la notificación push", error);
    }
  }
}
