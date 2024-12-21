import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {
  token: string | null = null;
  email: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  message: string = '';

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email = this.route.snapshot.queryParamMap.get('email') || '';
  }

  onSubmit() {
    const data = {
      token: this.token,
      email: this.email,
      password: this.password,
      password_confirmation: this.passwordConfirmation,
    };

    this.http
      .post('http://127.0.0.1:8000/api/reset-password', data)
      .subscribe((response: any) => {
        this.message = response.message;
      });
  }
}
