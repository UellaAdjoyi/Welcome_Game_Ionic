import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-task-details',
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.scss'],
})
export class TaskDetailsComponent {

  @Input() task: any;

  constructor(private modalController: ModalController) { }

  closeModal() {
    this.modalController.dismiss();
  }

}
