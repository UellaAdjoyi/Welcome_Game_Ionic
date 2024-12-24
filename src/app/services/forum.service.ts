import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private apiUrl = 'http://192.168.0.9:8000/api';

  constructor(private http: HttpClient) {}

  getPosts(): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts`);
  }

  getPostById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/posts/${id}`);
  }

  createPost(postData: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<any>(`${this.apiUrl}/create-posts`, postData, {
      headers,
    });
  }

  addComment(postId: number, data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      return throwError('User not authenticated');
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post<any>(
      `${this.apiUrl}/posts/${postId}/comments`,
      {
        content: data.content,
      },
      { headers }
    );
  }

  updatePost(post: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-posts/${post.id}`, post);
  }

  deletePost(postId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete-posts/${postId}`);
  }
}
