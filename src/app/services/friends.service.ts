import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private apiUrl = 'http://192.168.0.9:8000/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users`);
  }

  addFriend(userId: number, friendId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    console.log('Token récupéré:', token);

    if (!token) {
      console.error('User not authenticated');
      return throwError('User not authenticated');
    }

    const payload = {
      user_id: userId,
      friend_id: friendId,
    };

    return this.http
      .post(`${this.apiUrl}/friends`, payload, {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
        withCredentials: true,
      })
      .pipe(
        tap(() => console.log('Friend added successfully')),
        catchError((error) => {
          console.error('Error adding friend:', error);
          return throwError(error);
        })
      );
  }

  getFriends(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      console.error('User not authenticated');
      return throwError('User not authenticated');
    }

    return this.http.get<any[]>(`${this.apiUrl}/friends`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      withCredentials: true,
    });
  }

  sendInvitation(email: string, senderName: string) {
    return this.http.post(`${this.apiUrl}/send-invitation`, {
      recipient_email: email,
      sender_name: senderName,
    });
  }
}
