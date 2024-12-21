import { Component, OnInit } from '@angular/core';
import { FriendsService } from '../services/friends.service';
import { AuthService } from '../services/auth.service';

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
    private authService: AuthService
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

  addFriend(friendId: number) {
    this.friendsService.addFriend(this.currentUserId, friendId).subscribe({
      next: (response) => {
        console.log('Friend added:', response);
        this.loadUsers(); // Rechargez les utilisateurs pour mettre à jour l'interface
      },
      error: (error) => {
        console.error('Error adding friend:', error);
      },
    });
  }
}
