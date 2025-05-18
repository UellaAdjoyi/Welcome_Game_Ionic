import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class LeadearBoardService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) {}

  getLeaderboard():Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/leaderboard`, { headers });
  }
}
