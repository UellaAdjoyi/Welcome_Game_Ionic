import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, tap } from 'rxjs';
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

  createUser(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, data);
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

  /*isAdmin(): boolean {
    return this.user && this.user.is_admin === 1;
  }*/

  updateProfile(data: any) {
    return this.http.put(`${this.apiUrl}/user/profile-picture`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`,
      },
    });
  }

  uploadProfilePicture(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}/user/upload-profile-picture`, formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
      }
    });
  }


  changePassword(data: { current_password: string, new_password: string }) {
    return this.http.post(`${this.apiUrl}/change-password`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`,
      }
    });
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
