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

    this.sendLocalNotification('Orden Confirmada', `Tu número de orden es: ${orderNumber}`); // Use LocalNotification

    this.router.navigate(['/home']); 
  }

  goBack() {
    this.router.navigate(['/home']);
  }

  // Schedule a local notification
  private async sendLocalNotification(title: string, message: string) {
    try {
      await LocalNotifications.requestPermissions(); // Request permission to show notifications

      await LocalNotifications.schedule({
        notifications: [
          {
            title: title,
            body: message,
            id: new Date().getTime(),  // Use the current timestamp as unique ID
            schedule: { at: new Date(Date.now() + 1000) }, // Schedule the notification to appear in 1 second
            sound: 'default',
          }
        ]
      });

      console.log("Notification scheduled successfully!");

    } catch (error) {
      console.error("Error scheduling notification", error);
    }
  }
}
