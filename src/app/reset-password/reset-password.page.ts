import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import {ModalController, NavController, ToastController} from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.scss'],
    standalone: false
})
export class ResetPasswordPage implements OnInit {
  email: string = '';
  password: string = '';
  password_confirmation: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private navCtrl: NavController,
  ) {}

  ngOnInit() {
    /*this.token = this.route.snapshot.queryParamMap.get('token');
    this.email_address = this.route.snapshot.queryParamMap.get('email') || '';*/
  }

  onSubmit() {
    const data = {
      email: this.email,
      password: this.password,
      password_confirmation: this.password_confirmation,
    };

    this.http
      .post('http://127.0.0.1:8000/api/reset-password', data)
      .subscribe({
        next: (response: any) => {
          this.message = response.message;
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (err) => {
          this.message = err.error?.error || 'An error occurred during password reset.';
        },
      });
  }

  cancel() {
    this.navCtrl.back();
  }
}
