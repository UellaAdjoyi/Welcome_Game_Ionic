import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../services/auth.service';
import {NavController, ToastController} from '@ionic/angular';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.page.html',
  styleUrls: ['./sign-in.page.scss'],
  standalone: false,
})
export class SignInPage {
  form!: FormGroup;

  initForm() {
    this.form = new FormGroup({
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email],
      }),
      login: new FormControl(null, { validators: [Validators.required] }),
      role: new FormControl(null, { validators: [Validators.required] }),
    });
  }

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private toastController: ToastController,
    private navCtrl: NavController,
  ) {
    this.initForm();
  }
  goToLogIn() {
    this.router.navigate(['/']);
  }

  // onSubmit(event: Event) {
  //   if (this.form.invalid) {
  //     this.form.markAllAsTouched();
  //     return;
  //   }
  //   console.log(this.form.value);
  //   this.signIn();
  // }

  // async signIn() {
  //   try {
  //     const response = await this.authService
  //       .register(this.form.value)
  //       .toPromise();
  //     console.log('Backend :', response);
  //     const successToast = await this.toastController.create({
  //       message: 'You will receive a confirmation email!',
  //       duration: 5000,
  //       color: 'success',
  //     });
  //     await successToast.present();
  //   } catch (error) {
  //     console.error('Error:', error);

  //     const errorToast = await this.toastController.create({
  //       message: 'An error occurred during registration. Please try again!',
  //       duration: 3000,
  //       color: 'danger',
  //     });
  //     await errorToast.present();
  //   }
  // }
  // admin.page.ts
  async createUser() {
    const userData = {
      login: this.form.value.login,
      email: this.form.value.email,
      role: this.form.value.role,
    };

    try {
      const response = await this.authService.createUser(userData).toPromise();
      console.log('User created successfully', response);
      this.showToast('User created and email sent successfully. Redirecting to home page.. ');
    } catch (error) {
      this.showToast('Error creating user. Please verify the email address and try again.');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'danger'
    });
    toast.present();
  }
  cancel() {
    this.navCtrl.back();
  }
}
