import { Component, OnInit } from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from "@angular/forms";
import { AuthService } from '../services/auth.service';
import {IonicModule, NavController, ToastController} from "@ionic/angular";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
  imports: [
    ReactiveFormsModule,
    IonicModule
  ]
})
export class ChangePasswordPage  {

  form = this.fb.group({
    current_password: ['', Validators.required],
    new_password: ['', [Validators.required, Validators.minLength(6)]],
    confirm_password: ['', Validators.required],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastCtrl: ToastController,
    private navCtrl: NavController
  ) {}

  async submit() {
    const current_password = this.form.get('current_password')?.value ?? '';
    const new_password = this.form.get('new_password')?.value ?? '';
    const confirm_password = this.form.get('confirm_password')?.value;

    if (new_password !== confirm_password) {
      this.showToast('Les nouveaux mots de passe ne correspondent pas.');
      return;
    }

    try {
      if (current_password && new_password) {
        await this.authService.changePassword({
          current_password: current_password,
          new_password: new_password
        }).toPromise();
      } else {
        throw new Error('fields cannot be empty.');
      }

      this.showToast('password changed successfully. Redirecting to home page..');
      this.navCtrl.navigateRoot('/home');
    } catch (err) {
      // @ts-ignore
      this.showToast((err.error?.message || 'password change failed. Please try again.'));
    }
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      color: message.includes('successs') ? 'success' : 'danger'
    });
    await toast.present();
  }

  cancel() {
    this.navCtrl.back();
  }
}
