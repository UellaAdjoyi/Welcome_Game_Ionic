import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DashboardService } from '../services/dashboard.service';
import { Router } from '@angular/router';
import {AlertController, ToastController} from "@ionic/angular";
import {TasksService} from "../services/tasks.service";

@Component({
    selector: 'app-admin-dashboard',
    templateUrl: './admin-dashboard.page.html',
    styleUrls: ['./admin-dashboard.page.scss'],
    standalone: false
})
export class AdminDashboardPage implements OnInit {
  taskStats: any[] = [];
  users: any[] = [];
  filteredUsers: any[] = [];
  searchTerm: string = '';
  stats = {
    totalUsers: 0,
    totalPosts: 0,
    totalEvents: 0,
  };
  currentUserId: number = 0;

  constructor(
    private dashboardService: DashboardService,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController,
    private taskService:TasksService
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCurrentUser();
    this.loadDashboardStats();
    this.loadTaskStats();
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
        this.filteredUsers = users;
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  modifierRole(utilisateurId: number, nouveauRole: string) {
    this.dashboardService.updateRole(utilisateurId, nouveauRole).subscribe(
      (response) => {
        console.log('Role updated successfully:', response);
      },
      (error) => {
        console.error('Error :', error);
      }
    );
  }

  loadDashboardStats() {
    this.dashboardService.getDashboardStats().subscribe((data) => {
      this.stats = data;
    });
  }

  filterUsers() {
    const term = this.searchTerm.toLowerCase();
    this.filteredUsers = this.users.filter(user =>
      user.email.toLowerCase().includes(term)
    );
  }

  changerStatut(userId: number, isActive: boolean) {
    this.dashboardService.updateUserStatus(userId, isActive ? 1 : 0).subscribe(() => {
      this.showToast(`User ${isActive ? 'activated' : 'disabled'}.`);
    });
  }

  async changePassword(user: any) {
    const alert = await this.alertController.create({
      header: 'Change Password',
      message: `Are you sure you want to reset the password for <strong>${user.email}</strong>? A new password will be sent by email.`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Confirm',
          handler: () => {
            this.resetUserPassword(user.id);
          },
        },
      ],
    });
    await alert.present();
  }

  resetUserPassword(userId: number) {
    this.dashboardService.resetUserPassword(userId).subscribe({
      next: (res) => {
        this.showToast('New password sent to user by email.');
      },
      error: (err) => {
        console.error('Password reset error', err);
        this.showToast('Failed to reset password.');
      },
    });
  }

  loadTaskStats() {
    this.taskService.getTaskStats().subscribe(data => {
      this.taskStats = data;
    });
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  goToCreateUser() {
    this.router.navigate(['/sign-in']);
  }

}
