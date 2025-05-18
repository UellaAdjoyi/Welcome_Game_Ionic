import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ForumService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAllFeeds(): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/forum/feeds`, {headers});
  }

  createFeed(data: any): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post(`${this.apiUrl}/forum/feeds-create`, data, {headers});
  }

  addArticle(feedId: number, formData: FormData): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/forum/feeds/${feedId}/articles`, formData, {headers});
  }

  updateForumFeed(feedId: number, data: { title: string, description: string }) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/forum-feeds/${feedId}`, data, {headers});
  }


  deleteFeed(feedId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/forum/feed/${feedId}`, {headers});
  }

  getArticles(feedId: number): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/forum-feeds/${feedId}/articles`,{headers});
  }

  getFeedById(feedId: number): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get(`${this.apiUrl}/forum-feeds/${feedId}`, { headers });
  }

  updateArticle(id: number, data: any) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.put(`${this.apiUrl}/forum-articles/${id}`, data, { headers });
  }

  deleteArticle(id: number) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete(`${this.apiUrl}/forum-articles/${id}`, { headers });
  }



  getComments(articleId: number): Observable<any[]> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.get<any[]>(`${this.apiUrl}/articles/${articleId}/comments`,{headers});
  }

  addComment(articleId: number, content: string): Observable<any> {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.post(`${this.apiUrl}/articles/${articleId}/comments`, { article_content: content }, { headers });
  }

  likeComment(commentId: number) {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      throw new Error('User is not authenticated');
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    return this.http.post<{ likes: number }>(`${this.apiUrl}/forum-comments/${commentId}/like`, {}, { headers });
  }

  updateComment(commentId: number, data: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/comments/${commentId}`, data, this.getAuthHeader());
  }

  deleteComment(commentId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/comments/${commentId}`, this.getAuthHeader());
  }

  private getAuthHeader() {
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${localStorage.getItem('auth_token') || ''}`
      })
    };
  }

}
