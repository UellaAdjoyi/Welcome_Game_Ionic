import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../services/friends.service';
import { AuthService } from '../services/auth.service';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.page.html',
  styleUrls: ['./friends.page.scss'],
})
export class FriendsPage implements OnInit {
  users: any[] = [];
  currentUserId: number = 0;

  constructor(
    private friendsService: FriendsService,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadCurrentUser();
    this.loadUsers();
  }

  loadCurrentUser() {
    this.authService.getProfile().subscribe(
      (user) => {
        console.log('User profile:', user);
        this.currentUserId = user.id; // Assurez-vous que `id` est bien dans la réponse de l'API.
      },
      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
  }

  loadUsers() {
    this.friendsService.getUsers().subscribe((users) => {
      // Filtrer les utilisateurs pour exclure l'admin
      this.users = users.filter((user) => user.role !== 'admin');
    });
  }

  async addFriend(userId: number) {
    const user = this.users.find((u) => u.id === userId);
    if (!user) return;

    const currentUser = this.authService.getCurrentUser();
    const senderName = currentUser?.name || 'Unknown Sender';

    if (!senderName) {
      console.error('Error: Sender name is missing.');
      const toast = await this.toastController.create({
        message: 'Unable to retrieve your name. Please log in again.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    try {
      console.log('Sending data:', {
        recipient_email: user.email,
        sender_name: senderName,
      });

      await this.friendsService
        .sendInvitation(user.email_address, senderName)
        .toPromise();

      const toast = await this.toastController.create({
        message: `Friend request sent to ${user.first_name} ${user.last_name}!`,
        duration: 2000,
        color: 'success',
      });
      toast.present();
    } catch (error) {
      console.error('Error sending friend request:', error);
      const toast = await this.toastController.create({
        message: `Failed to send friend request. Please try again.`,
        duration: 2000,
        color: 'danger',
      });
      toast.present();
    }
  }
}
