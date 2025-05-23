import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {AlertController, ModalController, ToastController} from '@ionic/angular';
import { TasksService } from '../services/tasks.service';
import {Task} from "../interfaces/task";

@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
  standalone: false,
})
export class ChecklistPage implements OnInit {
  tasks: any[] = [];
  completedTaskIds: number[] = [];
  userRole: string = '';


  constructor(
    private tasksService: TasksService,
    private router: Router,
    private toastCtrl: ToastController,
  ) {}

  ngOnInit() {

    this.loadUserTasks();
    this.userRole = localStorage.getItem('user_role') || '';

  }

  loadUserTasks() {
    this.tasksService.loadTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
    this.tasksService.getCompletedTaskIds().subscribe(ids => this.completedTaskIds = ids);

  }

  isCompleted(taskId: number): boolean {
    return this.completedTaskIds.includes(taskId);
  }

  toggleCompleted(taskId: number) {
    this.tasksService.toggleCompleted(taskId).subscribe(async () => {
      if (this.isCompleted(taskId)) {
        this.completedTaskIds = this.completedTaskIds.filter(id => id !== taskId);
        this.loadUserTasks()
      } else {
        this.completedTaskIds.push(taskId);
      }
    });
  }

  goToCreateTask() {
    this.router.navigate(['/task-create']);
  }
  async deleteTask(taskId: number) {
  const confirmed = confirm('Sure you want to remove this task?');
  if (!confirmed) return;

  this.tasksService.deleteTask(taskId).subscribe({
    next: async () => {
      const toast = await this.toastCtrl.create({
        message: 'Task removed',
        duration: 2000,
        color: 'success',
      });
      toast.present();
      this.loadUserTasks();
    },
    error: async (err) => {
      const toast = await this.toastCtrl.create({
        message: err.status === 403 ? 'No permission to remove tasks' : 'Failed to remove',
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  });
}


}
