import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FriendsService {
  private apiUrl = 'http://192.168.0.10:8000/api';

  constructor(private http: HttpClient) {}

  getUsers(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return throwError('User not authenticated');
    }
    console.log('Token utilisé dans la requête:', token); // Ajoutez un log ici pour vérifier le token

    return this.http.get<any[]>(`${this.apiUrl}/users`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      withCredentials: true,
    });
  }

  aaddFriend(friendId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    console.log('Token récupéré:', token);

    // Vérifier si le token existe
    if (!token) {
      return throwError('User not authenticated');
    }

    console.log('Token utilisé dans la requête:', token);

    return this.http.post(
      `${this.apiUrl}/add-friend`,
      { friend_id: friendId },
      {
        headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
        withCredentials: true,
      }
    );
  }

  getFriends(): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    console.log('Token récupéré:', token);

    // Vérifier si le token existe
    if (!token) {
      return throwError('User not authenticated');
    }

    console.log('Token utilisé dans la requête:', token);

    return this.http.get<any[]>(`${this.apiUrl}/friends`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      withCredentials: true,
    });
  }

  getFriendIds(): Observable<number[]> {
    const token = localStorage.getItem('auth_token');
    console.log('Token récupéré:', token);

    // Vérifier si le token existe
    if (!token) {
      return throwError('User not authenticated');
    }

    console.log('Token utilisé dans la requête:', token);

    return this.http.get<number[]>(`${this.apiUrl}/friends/ids`, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
      withCredentials: true,
    });
  }
}
