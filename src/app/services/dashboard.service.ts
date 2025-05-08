import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
/*
  private apiUrl = environment.apiUrl;
*/
  private apiUrl = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    return this.http.get<any[]>(`${this.apiUrl}/user`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateRole(userId: number, newRole: string): Observable<any> {
    const token = localStorage.getItem('auth_token');

    return this.http.post(`${this.apiUrl}/user/${userId}/role`, {
      role: newRole,
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/stats`);
  }

  updateUserStatus(userId: number, is_active: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/user/users/${userId}/status`, { is_active }, this.getAuthHeader());
  }

  resetUserPassword(userId: number) {
/*
    return this.http.post(`/api/users/${userId}/reset-password`, {});
*/
    return this.http.post(`${this.apiUrl}/users/${userId}/reset-password`, {});
  }


  private getAuthHeader() {
    return {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('auth_token')}`
      }
    };
  }
}
