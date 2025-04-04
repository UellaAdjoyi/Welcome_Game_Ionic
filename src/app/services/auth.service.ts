import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, throwError } from 'rxjs';
import { StorageServiceService } from './storage-service.service';
import { UserProfileResponse } from '../interfaces/user-profile-response';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  userPoints: number = 0;
  private user: { is_admin: number; [key: string]: any } = { is_admin: 0 };
  private currentUser: any;

  constructor(private http: HttpClient) {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
      } catch (error) {
        console.error('Error parsing stored user:', error);
      }
    }
  }

  register(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, data);
  }
  login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }

  getProfile(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    console.log('Token récupéré:', token);
    if (!token) {
      return throwError('User not authenticated');
    }
    console.log('Token used in request:', token);
    return this.http.get(`${this.apiUrl}/profile`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      withCredentials: true,
    });
  }

  isAdmin(): boolean {
    return this.user && this.user.is_admin === 1;
  }

  updateProfile(data: any) {
    return this.http.put(`${this.apiUrl}/updateProfile`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
  }

  generateResetCode(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/generate-reset-code`, {
      email_address: email,
    });
  }

  resetPassword(data: {
    email_address: string;
    code: string;
    password: string;
    password_confirmation: string;
  }): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, data);
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (token) {
      return this.http
        .post(
          `${this.apiUrl}/logout`,
          {},
          {
            headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
          }
        )
        .pipe(
          // Clear user data and token from local storage
          tap(() => {
            localStorage.removeItem('auth_token');
            localStorage.removeItem('user');
          })
        );
    }
    return throwError('User not authenticated');
  }

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  updateUser(user: any) {
    this.userSubject.next(user);
  }

  getUser() {
    return this.userSubject.value;
  }

  setCurrentUser(user: any) {
    this.currentUser = user;
  }

  getCurrentUser() {
    return this.currentUser;
  }
}
