import { Component, OnInit } from '@angular/core';
import {TasksService} from "../services/tasks.service";
import {Router} from "@angular/router";
import {IonicModule, ModalController, NavController, ToastController} from "@ionic/angular";
import {Task} from "../interfaces/task";
import {FormsModule} from "@angular/forms";

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.page.html',
  styleUrls: ['./task-create.page.scss'],
  imports: [
    IonicModule,
    FormsModule
  ]
})
export class TaskCreatePage {
  newTask: Task = {
    title: '',
    description: '',
    link: '',
    is_active: true,
    id: 0
  };

  constructor(
    private tasksService: TasksService,
    private router: Router,
    private toastCtrl: ToastController,
    private navCtrl: NavController,

  ) {}

  async createTask() {
    this.tasksService.createTask(this.newTask).subscribe({
      next: async (task) => {
        const toast = await this.toastCtrl.create({
          message: 'Task created successfully!',
          duration: 2000,
          color: 'success',
        });
        await toast.present();
        this.router.navigate(['/admin/tasks']); // adapte selon ta route
      },
      error: async (err) => {
        const toast = await this.toastCtrl.create({
          message: 'Error creating task',
          duration: 2000,
          color: 'danger',
        });
        await toast.present();
        console.error(err);
      },
    });
  }

  cancel() {
    this.navCtrl.back();
  }
}
