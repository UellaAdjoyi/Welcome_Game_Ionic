import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
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
}
