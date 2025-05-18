import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError, tap } from 'rxjs';
import {environment} from "../../environments/environment";
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = environment.apiUrl;
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

  /*login(data: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, data);
  }*/
  login(data: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, data).pipe(
      tap(response => {
        //  token
        localStorage.setItem('auth_token', response.token);

        // Users data
        if (response.user) {
          localStorage.setItem('user', JSON.stringify(response.user));
        }
      })
    );
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

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/deleteUsers/${id}`);
  }




  getCurrentUser() {
    return this.currentUser;
  }
}
