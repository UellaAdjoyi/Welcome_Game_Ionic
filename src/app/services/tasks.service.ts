import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {Task} from '../interfaces/task';
import {Observable} from "rxjs";
import {environment} from "../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class TasksService {
    private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient) {
  }

  loadTasks() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.get<any[]>(`${this.apiUrl}/tasks`,{headers});
  }

  getCompletedTaskIds(): Observable<number[]> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<number[]>(`${this.apiUrl}/user/completed-tasks`,{headers: headers});
  }


  toggleCompleted(taskId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/tasks/${taskId}/toggle-complete`, {}, { headers });
  }



  createTask(task: Task): Observable<Task> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<Task>(`${this.apiUrl}/tasks/create`, task,{headers: headers});
  }

  getTaskStats(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/admin/task-stats`,{headers});
  }
  deleteTask(taskId: number) {
  const token = localStorage.getItem('auth_token');
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${token}`
  });
  return this.http.delete(`${this.apiUrl}/tasks/${taskId}`, { headers });
}


}


