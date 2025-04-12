import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.page.html',
    styleUrls: ['./forgot-password.page.scss'],
    standalone: false
})
export class ForgotPasswordPage implements OnInit {
  private apiUrl = 'http://192.168.0.10:8000/api/forgot-password';
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.fb.group({
      email_address: [null, [Validators.required, Validators.email]],
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const email = this.form.value.email_address;

    this.http.post(this.apiUrl, { email_address: email }).subscribe(
      async (response: any) => {
        const toast = await this.toastController.create({
          message: 'Reset link sent to your email.',
          duration: 3000,
          color: 'success',
        });
        await toast.present();
      },
      async (error) => {
        // Gérer les erreurs et afficher un toast
        const toast = await this.toastController.create({
          message: 'Error sending reset link. Please try again.',
          duration: 3000,
          color: 'danger',
        });
        await toast.present();
      }
    );
  }
}
