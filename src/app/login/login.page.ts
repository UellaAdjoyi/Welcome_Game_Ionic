import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { IonContent, IonicModule, ToastController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: false,
})
export class LoginPage implements OnInit {
  form!: FormGroup;

  initForm() {
    this.form = new FormGroup({
      login: new FormControl(null, {
        validators: [Validators.required],
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(8)],
      }),
    });
  }
  constructor(
    private router: Router,
    private authService: AuthService,
    private toastController: ToastController
  ) {}
  ngOnInit(): void {
    this.initForm();
  }



  onLogin() {
    this.router.navigate(['/home']);
  }

  async login() {
    if (this.form.invalid) {
      return;
    }

    const loginData = {
      login: this.form.value.login,
      password: this.form.value.password,
    };

    try {
      const response = await this.authService.login(loginData).toPromise();
      console.log('Login Response:', response);
      if (response?.token) {
        // Save the token to localStorage
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user_email', response.user.email);
        localStorage.setItem('user_role', response.user.role);
        console.log(
          'Token stored in localStorage:',
          localStorage.getItem('auth_token')
        );

        const mustChange = response.user?.must_change_password;
        if (mustChange) {
          this.router.navigate(['/change-password']);
        } else {
          this.router.navigate(['/home']);
        }
      } else {
        this.showToast('Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      this.showToast('Incorrect credentials.');
    }
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color: 'danger',
    });
    toast.present();
  }

  goToForgotPassword() {
    this.router.navigate(['/reset-password']);
  }
}
