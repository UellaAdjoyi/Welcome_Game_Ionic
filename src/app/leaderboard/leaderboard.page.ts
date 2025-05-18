import { Component, OnInit } from '@angular/core';
import { LeadearBoardService } from '../services/leadear-board.service';
import { HttpClient } from '@angular/common/http';

interface LeaderboardUser {
  name: string;
  points_sum_points: number; // La somme des points
}

@Component({
    selector: 'app-leaderboard',
    templateUrl: './leaderboard.page.html',
    styleUrls: ['./leaderboard.page.scss'],
    standalone: false
})
export class LeaderboardPage implements OnInit {
  leaderboard: any[] = [];
  currentUser: any = null;

  constructor(
    private leaderboardService: LeadearBoardService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.leaderboardService.getLeaderboard().subscribe(data => {
      this.leaderboard = data;
    });  }

  loadLeaderboard() {
    this.leaderboardService.getLeaderboard().subscribe(
      (data) => {
        this.leaderboard = data;
        this.currentUser = this.leaderboard.find(
          (user) => user.username === 'CurrentUser'
        );
      },
      (error) => {
        console.error('Error loading :', error);
      }
    );
  }
}
