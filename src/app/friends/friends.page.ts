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
    if (!user) {
      console.error('User not found for ID:', userId);
      return;
    }

    const recipientEmail = user.email || user.email_address;
    if (!recipientEmail) {
      console.error('Recipient email is missing:', user);
      const toast = await this.toastController.create({
        message: 'Recipient email is missing.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
      return;
    }

    try {
      // Récupérez les informations de l'utilisateur actuel
      const currentUser = await this.authService.getProfile().toPromise();
      const senderName =
        currentUser.username ||
        `${currentUser.first_name} ${currentUser.last_name}` ||
        'Unknown Sender';

      console.log('Sending data:', {
        recipient_email: recipientEmail,
        sender_name: senderName,
      });

      await this.friendsService
        .sendInvitation(recipientEmail, senderName)
        .toPromise();

      const toast = await this.toastController.create({
        message: `Friend request sent to ${user.first_name} ${user.last_name}!`,
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error('Error sending friend request:', error);
      const toast = await this.toastController.create({
        message: 'Failed to send friend request. Please try again.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
