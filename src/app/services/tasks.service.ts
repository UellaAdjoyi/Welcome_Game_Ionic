import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private apiUrl = 'http://192.168.0.10:8000/api/tasks';

  constructor(private http: HttpClient) {}

  getTasks() {
    return this.http.get<any[]>(this.apiUrl);
  }

  markTaskComplete(taskId: number) {
    return this.http.put(`${this.apiUrl}/${taskId}`, { completed: true });
  }

  unmarkTaskComplete(taskId: number) {
    return this.http.put(`${this.apiUrl}/${taskId}`, { completed: false });
  }

  getCompletedTasks() {
    return this.http.get<any[]>(`${this.apiUrl}/completed`);
  }

  updateTaskStatus(taskId: number, completed: boolean) {
    return this.http.put(`${this.apiUrl}/${taskId}`, { completed });
  }

  completedTasks: any[] = [];

  // markTaskComplete(task: any) {
  //   task.completed = true;
  //   if (!this.completedTasks.includes(task)) {
  //     this.completedTasks.push(task);
  //   }
  // }

  // unmarkTaskComplete(task: any) {
  //   task.completed = false;
  //   this.completedTasks = this.completedTasks.filter((t) => t !== task);
  // }

  // getCompletedTasks() {
  //   return this.completedTasks;
  // }
}
