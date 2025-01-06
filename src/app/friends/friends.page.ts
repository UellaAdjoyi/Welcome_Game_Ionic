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
  friendIds: number[] = [];
  friends: any[] = [];

  constructor(
    private friendsService: FriendsService,
    private authService: AuthService,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadUsers();
    this.loadCurrentUser();
  }

  loadCurrentUser() {
    this.authService.getProfile().subscribe(
      (user) => {
        this.currentUserId = user.id;
        this.loadFriendsAndUsers();
      },
      (error) => {
        console.error('Error loading user profile:', error);
      }
    );
  }

  loadFriendsAndUsers() {
    this.friendsService.getFriends().subscribe(
      (friends) => {
        console.log(friends);
        this.friends = friends;
        this.friendIds = friends.map((friend) => friend.id);

        this.loadUsers();
      },
      (error) => {
        console.error('Error loading friends:', error);
      }
    );
  }

  loadUsers() {
    this.friendsService.getUsers().subscribe(
      (users) => {
        // Filtrer les utilisateurs qui ne sont ni amis ni l'utilisateur actuel
        this.users = users.filter(
          (user) =>
            !this.friendIds.includes(user.id) && user.id !== this.currentUserId
        );
      },
      (error) => {
        console.error('Error loading users:', error);
      }
    );
  }

  async addFriend(userId: number) {
    try {
      await this.friendsService.aaddFriend(userId).toPromise();

      // Mettre à jour les listes après ajout
      const addedUser = this.users.find((user) => user.id === userId);
      this.friends.push(addedUser);
      this.friendIds.push(userId);
      this.users = this.users.filter((user) => user.id !== userId);

      const toast = await this.toastController.create({
        message: 'Friend added successfully!',
        duration: 2000,
        color: 'success',
      });
      await toast.present();
    } catch (error) {
      console.error('Error adding friend:', error);
      const toast = await this.toastController.create({
        message: 'Failed to add friend. Please try again.',
        duration: 2000,
        color: 'danger',
      });
      await toast.present();
    }
  }
}
