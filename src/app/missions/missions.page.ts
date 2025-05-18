import { Component, OnInit } from '@angular/core';
import {AlertController, IonicModule, ToastController} from "@ionic/angular";
import {MissionsService} from "../services/missions.service";
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";
import {Route, Router} from "@angular/router";


@Component({
  selector: 'app-missions',
  templateUrl: './missions.page.html',
  styleUrls: ['./missions.page.scss'],
  imports: [
    IonicModule,
    NgIf,
    NgForOf
  ]
})
export class MissionsPage implements OnInit {
  missions: any [] = [];
  selectedFile: File | null = null;
  userRole: string = '';

  constructor(
    private missionService: MissionsService,
    private http:HttpClient,
    private alertController:AlertController,
    private toastController:ToastController,
    private router: Router,
  ) { }

  ngOnInit() {
    this.userRole = localStorage.getItem('user_role') || '';
    this.loadMissions();
  }

  loadMissions() {
    this.missionService.getMissions().subscribe(data => this.missions = data);
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit(missionId: number) {
    if (this.selectedFile) {
      this.missionService.submitProof(missionId, this.selectedFile).subscribe(() => {
        alert('Soumission envoyée');
      });
    }
  }

  async CreateMission() {
    const alert = await this.alertController.create({
      header: 'Créer une mission',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Titre de la mission'
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description de la mission'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel'
        },
        {
          text: 'Créer',
          handler: data => {
            if (!data.title || !data.description) {
              // Affiche une erreur si un champ est vide
              alert.message = 'Veuillez remplir tous les champs';
              return false;
            }

            this.missionService.createMission({
              title: data.title,
              description: data.description
            }).subscribe({
              next: () => {
                this.showToast("Mission added successfully");
                this.loadMissions();
              },
              error: () => {
                this.showToast("Error creating the mission.");
              }
            });

            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  goToMySubmissions() {
    this.router.navigate(['/my-submissions']);
  }
}
