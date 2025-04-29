import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.page.html',
    styleUrls: ['./reset-password.page.scss'],
    standalone: false
})
export class ResetPasswordPage implements OnInit {
  token: string | null = null;
  email_address: string = '';
  password: string = '';
  passwordConfirmation: string = '';
  message: string = '';

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    this.email_address = this.route.snapshot.queryParamMap.get('email') || '';
  }

  onSubmit() {
    const data = {
      token: this.token,
      email_address: this.email_address,
      password: this.password,
      password_confirmation: this.passwordConfirmation,
    };

    this.http
      .post('http://192.168.0.10:8000/api/reset-password', data)
      .subscribe((response: any) => {
        this.message = response.message;
      });
  }
}
