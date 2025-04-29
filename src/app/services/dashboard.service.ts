import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  private apiUrl = environment.apiUrl;
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
