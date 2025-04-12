import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../services/friends.service';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { Chart } from 'chart.js';

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.page.html',
    styleUrls: ['./admin-dashboard.page.scss'],
    standalone: false
})
export class AdminDashboardPage implements OnInit {
  users: any[] = [];
  stats = {
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
  };
  currentUserId: number = 0;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCurrentUser();
    this.loadDashboardStats();
  }

  loadCurrentUser() {
    this.authService.getProfile().subscribe(
      (user) => {
        this.currentUserId = user.id;
      },
      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
  }

  loadUsers() {
    this.dashboardService.getUsers().subscribe(
      (users) => {
        this.users = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  modifierRole(utilisateurId: number, nouveauRole: string) {
    this.dashboardService.updateRole(utilisateurId, nouveauRole).subscribe(
      (response) => {
        console.log('Role modifié avec succès:', response);
      },
      (error) => {
        console.error('Error modifiant le role:', error);
      }
    );
  }

  loadDashboardStats() {
    this.dashboardService.getDashboardStats().subscribe((data) => {
      this.stats = data;
    });
  }
}
