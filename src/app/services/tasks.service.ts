import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'http://192.168.0.10:8000/api';

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<any[]>(`${this.apiUrl}/tasks`);
  }

  updateTaskCompletion(taskId: number, completed: boolean): Observable<any> {
    const token = localStorage.getItem('auth_token');

    if (!token) {
      return throwError('User not authenticated');
    }

    return this.http.put<any>(
      `${this.apiUrl}/tasks/${taskId}/progress`,
      { completed: completed }, // Assurez-vous que "completed" est bien inclus ici
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
        withCredentials: true,
      }
    );
  }

  // Service pour récupérer les tâches d'un utilisateur
  getUserTasks(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/user/tasks`, { headers });
  }
}
