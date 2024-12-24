import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class EventServiceService {
  private apiUrl = 'http://192.168.0.9:8000/api';
  private pointsSubject = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient, private authService: AuthService) {}

  getNearbyEvents(
    latitude: number,
    longitude: number,
    radius: number
  ): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/nearby-events`, {
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        radius: radius.toString(),
      },
    });
  }

  createEvent(eventData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User not authenticated');
    }

    return this.http.post(`${this.apiUrl}/events`, eventData, {
      headers: new HttpHeaders().set('Authorization', `Bearer ${token}`),
    });
  }

  joinEvent(eventId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    console.log('Token récupéré:', token);
    if (!token) {
      return throwError('User not authenticated');
    }
    console.log('Token used in request:', token);

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(
      `${this.apiUrl}/events/${eventId}/join`,
      {},
      { headers }
    );
  }

  getUserPoints(): Observable<any> {
    const token = localStorage.getItem('auth_token');

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any>(`${this.apiUrl}/points`, { headers });
  }

  getPointsObservable(): Observable<number> {
    return this.pointsSubject.asObservable();
  }

  updateUserPoints(): void {
    this.getUserPoints().subscribe(
      (data) => {
        this.pointsSubject.next(data.user_points);
      },
      (error) => {
        console.error('Error loading user points:', error);
      }
    );
  }

  getAllEvents(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return throwError('User not authenticated');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get(`${this.apiUrl}/admin/events`, { headers });
  }

  updateEvent(event: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/events/${event.id}`, event);
  }

  deleteEvent(eventId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/events/${eventId}`);
  }
}
