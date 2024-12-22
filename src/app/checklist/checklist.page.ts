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
    private tasksService: TasksService,
    private router: Router,
    private alertController: AlertController,
    private inAppBrowser: InAppBrowser,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.loadTasks();
  }

  loadTasks() {
    this.tasksService.getTasks().subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  toggleTaskCompletion(taskId: number) {
    const task = this.tasks.find((t) => t.id === taskId);

    if (!task) {
      console.error('Tâche non trouvée');
      return;
    }

    const newStatus = !task.completed; // Inverse l'état actuel
    console.log('Ancien état de la tâche :', task.completed);
    console.log('Nouvel état calculé :', newStatus);

    this.tasksService.updateTaskCompletion(taskId, newStatus).subscribe(
      (response) => {
        console.log("Réponse de l'API :", response);
        if (response && response.completed !== undefined) {
          task.completed = response.completed; // Assurez-vous que l'état local reflète la réponse de l'API
          console.log('État local mis à jour :', task.completed);
        }
      },
      (error) => {
        console.error('Erreur lors de la mise à jour de la tâche :', error);
      }
    );
  }

  checkAuthentication() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.router.navigate(['/login']);
    }
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
