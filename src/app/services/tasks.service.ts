import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<any[]>(`${this.apiUrl}/tasks`);
  }

  updateTaskCompletion(taskId: number, completed: boolean): Observable<any> {
    const token = localStorage.getItem('auth_token');
    console.log('Token récupéré:', token);
    if (!token) {
      return throwError('User not authenticated');
    }

    console.log('Token used in request:', token);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.put(
      `${this.apiUrl}/tasks/${taskId}/progress`,
      { completed }, // données de la requête
      { headers, withCredentials: true } // options
    );
  }

  getCompletedTasks(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return throwError('User not authenticated');
    }

    return this.http.get(`${this.apiUrl}/tasks/completed`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }
}
