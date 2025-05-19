import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { AlertController, ToastController } from '@ionic/angular';
import { NavController } from '@ionic/angular';
import { EventServiceService } from '../services/event-service.service';
import { Event, Router } from '@angular/router';
import { FriendsService } from '../services/friends.service';
import { TasksService } from '../services/tasks.service';
import { UserProfileResponse } from '../interfaces/user-profile-response';
import {MissionsService} from "../services/missions.service";

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

  constructor(
    private authService: AuthService,
    private missionService: MissionsService,
    private router: Router,
    private friendsService: FriendsService,
  ) {}

  ngOnInit() {
    this.loadProfile();
    this.loadUserPoints();
    this.loadFriendsCount();
    this.authService.user$.subscribe((user: UserProfileResponse) => {
      if (user) {
        this.user = user;
      } else {
        this.loadProfile();
      }
    });
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
    this.missionService.getUserPoints().subscribe(
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


  loadFriendsCount() {
    this.friendsService.getFriends().subscribe({
      next: (friends) => {
        this.friendsCount = friends.length; // Compte les amis
        console.log(":", this.friendsCount);
      },
      error: (error) => {
        console.error(':', error);
      },
    });
  }
  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    path = path.replace(/^\/+/, '');

    // add /storage to the link if not exist
    if (!path.startsWith('storage/')) {
      path = 'storage/' + path;
    }

    return `http://127.0.0.1:8000/${path}`;
  }


  goToChangePassword() {
    this.router.navigate(['/change-password']);
  }
}
