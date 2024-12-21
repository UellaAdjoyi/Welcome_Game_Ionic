import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {
  token: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParamMap.get('token');
    if (this.token) {
      this.token = decodeURIComponent(this.token); // Décoder l'URL si nécessaire
      this.verifyEmail(this.token);
    }
  }

  // Fonction pour envoyer le token au backend pour vérifier l'email
  verifyEmail(token: string) {
    const tokenId = token.split('|')[0];
    this.http.get(`http://127.0.0.1:8000/api/verify-email/${token}`).subscribe(
      (response) => {
        console.log('Email verified successfully', response);
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Verification failed', error);
      }
    );
  }
}
