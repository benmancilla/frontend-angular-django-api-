import { Component, OnInit } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ItemService } from '../item.service';
import { ToastController, AlertController } from '@ionic/angular';
import { Item } from '../item.model';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  username: string = '';
  dishes: Item[] = [];

  constructor(
    private orderService: OrderService,
    private itemService: ItemService,
    private toastController: ToastController,
    private alertController: AlertController // Alert controller for notifications
  ) {}

  ngOnInit() {
    this.loadItems();
    this.setupPushNotifications(); // Initialize push notifications
  }

  ionViewWillEnter() {
    this.username = this.getUsername();
  }

  private getUsername(): string {
    return localStorage.getItem('username') || 'Usuario';
  }

  private loadItems() {
    this.itemService.getItems().subscribe((data) => {
      this.dishes = data;
    });
  }

  async addDish(dish: Item) {
    this.orderService.addDish(dish);
    const toast = await this.toastController.create({
      message: 'Plato añadido a su orden',
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }

  // Set up push notifications for the HomePage
  private setupPushNotifications() {
    // Listener for when a notification is received
    PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
      console.log('Push notification received on HomePage:', notification);
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
