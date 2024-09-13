import { Component } from '@angular/core';
import { OrderService } from '../services/order.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage {
  username: string = '';

  dishes = [
    { name: 'Lasaña Tradicional', price: 3500 },
    { name: 'Gnocchis Tradicionales', price: 2800 },
    { name: 'Risotto Tradicional', price: 2000 }
  ];

  constructor(private orderService: OrderService, private toastController: ToastController) { }

  ionViewWillEnter() {
    this.username = this.getUsername();
  }

  private getUsername(): string {
    return localStorage.getItem('username') || 'Usuario';
  }

  async addDish(dish: { name: string; price: number }) {
    this.orderService.addDish(dish);
    const toast = await this.toastController.create({
      message: 'Plato añadido a su orden',
      duration: 2000,
      position: 'bottom'
    });
    toast.present();
  }
}

