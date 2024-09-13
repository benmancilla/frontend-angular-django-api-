// login.page.ts
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';


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

  async onLogin() {
    const { username, password } = this.loginForm.value;
    const storedPassword = localStorage.getItem('password') || 'contra'; // Contraseña predeterminada

    localStorage.setItem('username', username);
    if (username === 'ben' && password === storedPassword) {
      this.router.navigate(['/home']);
    } else {
      const alert = await this.alertController.create({
        header: 'Error de validación',
        message: 'Nombre de usuario y/o contraseña incorrectos.',
        buttons: ['OK']
      });
      await alert.present();
    }
  }

  goToPasswordReset() {
    this.router.navigate(['/passreset']);
  }
}
