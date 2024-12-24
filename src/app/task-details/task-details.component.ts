import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent implements OnInit {
  @Input() task: any;
  pieces: string[] = [];

  constructor(private modalController: ModalController) {}

  ngOnInit() {
    // Décoder le champ pieces si c'est une chaîne JSON
    if (this.task && this.task.pieces) {
      try {
        this.pieces = Array.isArray(this.task.pieces)
          ? this.task.pieces
          : JSON.parse(this.task.pieces);
      } catch (error) {
        console.error('Erreur lors du décodage des pièces:', error);
      }
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
