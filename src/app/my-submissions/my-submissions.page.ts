import { Component, OnInit } from '@angular/core';
import {MissionsService} from "../services/missions.service";
import {IonicModule, NavController} from "@ionic/angular";
import {NgClass, NgForOf, NgIf} from "@angular/common";

@Component({
  selector: 'app-my-submissions',
  templateUrl: './my-submissions.page.html',
  styleUrls: ['./my-submissions.page.scss'],
  imports: [
    IonicModule,
    NgClass,
    NgIf,
    NgForOf
  ]
})
export class MySubmissionsPage implements OnInit {

  mySubmissions: any[] = [];

  constructor(
    private missionService: MissionsService,
    private navCtrl:NavController
    ) {}

  ngOnInit() {
    this.loadMySubmissions();
  }

  loadMySubmissions() {
    this.missionService.getMySubmissions().subscribe(data => {
      this.mySubmissions = data;
    });
  }


  cancel() {
    this.navCtrl.back();
  }
}
