import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { TasksService } from '../services/tasks.service';
import { TaskDetailsComponent } from '../task-details/task-details.component';
@Component({
  selector: 'app-checklist',
  templateUrl: './checklist.page.html',
  styleUrls: ['./checklist.page.scss'],
})
export class ChecklistPage implements OnInit {
  tasks: any[] = [
    // { name: 'VLS-TS', description: 'Visa long séjour temporaire' },
    // { name: 'Bank', description: 'Ouverture d’un compte bancaire' },
    // { name: 'Ameli', description: 'Inscription à la sécurité sociale' },
    // { name: 'Caf', description: 'Inscription à la CAF' }
  ];

  constructor(
    private TasksService: TasksService,
    private router: Router,
    private alertController: AlertController,
    private inAppBrowser: InAppBrowser,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.TasksService.getTasks().subscribe((data) => {
      this.tasks = data; // Charge toutes les tâches depuis l'API
    });
  }
  toggleComplete(task: any) {
    const completed = !task.completed;
    this.TasksService.updateTaskStatus(task.id, completed).subscribe(() => {
      task.completed = completed; // Mettez à jour localement l'état de la tâche
    });
  }

  async showGuide(task: any) {
    const browser = this.inAppBrowser.create(task.guideUrl, '_system'); // '_system' ouvre le lien dans le navigateur externe
    browser.show();
  }
  async voirDetails(task: any) {
    const modal = await this.modalController.create({
      component: TaskDetailsComponent,
      componentProps: { task },
    });

    return await modal.present();
  }
}
