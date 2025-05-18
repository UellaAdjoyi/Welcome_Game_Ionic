import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class MissionsService {
  private apiUrl=environment.apiUrl;

  constructor(
    private http:HttpClient,
  ) { }

  getMissions():Observable<any[]>  {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/missions`, { headers });
  }

  createMission(mission: { title: string; description: string }) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/missions`, mission, { headers });
  }

  submitProof(missionId: number, photo: File) {
    const formData = new FormData();
    formData.append('mission_id', missionId.toString());
    formData.append('photo', photo);
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/missions/submit`, formData, { headers });
  }

  getPendingSubmissions(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/missions/pending`, { headers });
  }

  validateSubmission(id: number, status: 'accepted' | 'rejected', points?: number) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/missions/validate/${id}`, { status, points }, { headers });
  }

  getMySubmissions() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/my-submissions`, { headers });
  }

  getLeaderboard() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/leaderboard`, { headers });
  }

}
