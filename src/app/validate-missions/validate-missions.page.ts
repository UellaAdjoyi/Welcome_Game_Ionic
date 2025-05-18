import { Component, OnInit } from '@angular/core';
import {MissionsService} from "../services/missions.service";
import {IonicModule} from "@ionic/angular";
import {FormsModule} from "@angular/forms";
import {NgForOf} from "@angular/common";

@Component({
  selector: 'app-validate-missions',
  templateUrl: './validate-missions.page.html',
  styleUrls: ['./validate-missions.page.scss'],
  imports: [
    IonicModule,
    FormsModule,
    NgForOf
  ]
})
export class ValidateMissionsPage implements OnInit {

  submissions:any [] = [];

  constructor(
    private missionService: MissionsService
  ) {}

  ngOnInit() {
    this.loadPending();
  }

  loadPending() {
    this.missionService.getPendingSubmissions().subscribe(data => {
      return this.submissions = data;
    });
  }

  validate(sub: any, status: 'accepted' | 'rejected', points?: number) {
    this.missionService.validateSubmission(sub.id, status, points).subscribe(() => {
      sub.status = status;
      sub.points_awarded = points;
    });
  }


}
