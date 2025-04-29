import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { TasksService } from '../services/tasks.service';
import { TaskDetailsComponent } from '../task-details/task-details.component';
import { Browser } from '@capacitor/browser';
@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
  standalone: false,
})
export class ChecklistPage implements OnInit {
  tasks: any[] = [
    // { name: 'VLS-TS', description: 'Visa long séjour temporaire' },
    // { name: 'Bank', description: 'Ouverture d’un compte bancaire' },
    // { name: 'Ameli', description: 'Inscription à la sécurité sociale' },
    // { name: 'Caf', description: 'Inscription à la CAF' }
  ];

  constructor(
    private tasksService: TasksService,
    private router: Router,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadUserTasks();
  }

  loadUserTasks() {
    this.tasksService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  checkAuthentication() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/login']);
    }
  }

  toggleTaskCompletion(taskId: number, completed: boolean) {
    this.tasksService.updateTaskCompletion(taskId, completed).subscribe(() => {
      const taskIndex = this.tasks.findIndex((task) => task.id === taskId);
      if (taskIndex !== -1) {
        this.tasks[taskIndex].completed = completed;
      }
    });
  }

  async showGuide(task: any) {
    await Browser.open({ url: task.guideUrl });
  }
  async voirDetails(task: any) {
    const modal = await this.modalController.create({
      component: TaskDetailsComponent,
      componentProps: { task },
    });

    return await modal.present();
  }
}
