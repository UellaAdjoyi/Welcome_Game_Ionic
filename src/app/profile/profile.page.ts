import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { EventServiceService } from '../services/event-service.service';
import { Event, Router } from '@angular/router';
import { FriendsService } from '../services/friends.service';
import { TasksService } from '../services/tasks.service';
import { UserProfileResponse } from '../interfaces/user-profile-response';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: false,
})
export class ProfilePage implements OnInit {
  user: any = null; //store user information
  loading = true;
  userPoints: number = 0;
  friendsCount: number = 0;
  completedTasks: any[] = [];

  constructor(
    private authService: AuthService,
    private eventService: EventServiceService,
    private router: Router,
    private navCtrl: NavController,
    private alertController: AlertController,
    private toastController: ToastController,
    private friendsService: FriendsService,
    private taskService: TasksService
  ) {}

  ngOnInit() {
    this.checkAuthentication();
    this.loadProfile();
    this.loadUserPoints();
    this.loadFriendsCount();
    this.loadCompletedTasks();

    this.authService.user$.subscribe((user: UserProfileResponse) => {
      if (user) {
        this.user = user;
      } else {
        this.loadProfile();
      }
    });
  }

  checkAuthentication() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.navCtrl.navigateRoot('/');
    }
  }

  async loadProfile() {
    try {
      const profile = await this.authService.getProfile().toPromise();
      console.log('User profile loaded:', profile);
      this.user = profile.user || profile;
      this.loading = false;
    } catch (error) {
      console.error('Error loading profile:', error);
      this.loading = false;
    }
  }

  loadUserPoints() {
    this.eventService.getUserPoints().subscribe(
      (data) => {
        this.userPoints = data.user_points;
      },
      (error) => {
        console.error('Cant find points:', error);
      }
    );
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Logout successfully', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
  }

  async presentUpdateProfilePopup() {
    const alert = await this.alertController.create({
      header: 'Update your profile',
      inputs: [
        {
          name: 'first_name',
          type: 'text',
          placeholder: 'First Name',
          value: this.user?.first_name || '',
        },
        {
          name: 'last_name',
          type: 'text',
          placeholder: 'Last Name',
          value: this.user?.last_name || '',
        },
        {
          name: 'username',
          type: 'text',
          placeholder: 'Username',
          value: this.user?.username || '',
        },
        {
          name: 'email_address',
          type: 'email',
          placeholder: 'Email',
          value: this.user?.email_address || '',
        },
        {
          name: 'phone_number',
          type: 'tel',
          placeholder: 'Phone number',
          value: this.user?.phone_number || '',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Update',
          handler: (data) => {
            const updatedProfile = {
              first_name: data.first_name,
              last_name: data.last_name,
              username: data.username,
              email_address: data.email_address,
              phone_number: data.phone_number,
            };

            this.authService.updateProfile(updatedProfile).subscribe({
              next: (response: any) => {
                this.user = response.user;
                this.presentToast('Profile updated successfully');
              },
              error: (err) => {
                console.error('Update failed:', err);
                this.presentToast('Failed to update profile');
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    await toast.present();
  }

  loadFriendsCount() {
    this.friendsService.getFriends().subscribe({
      next: (friends) => {
        this.friendsCount = friends.length; // Compte les amis
        console.log("Nombre d'amis chargés:", this.friendsCount);
      },
      error: (error) => {
        console.error('Impossible de charger les amis:', error);
      },
    });
  }

  goToChecklist() {
    this.router.navigate(['/checklist']);
  }

  loadCompletedTasks() {
    this.taskService.getCompletedTasks().subscribe(
      (response) => {
        console.log(' Completed tasks:', response);
        this.completedTasks = response;
      },
      (error) => {
        console.error('can t find completed tasks:', error);
      }
    );
  }
}
