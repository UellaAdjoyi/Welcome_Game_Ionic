import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root',
})
export class StorageServiceService {
  constructor(private storage: Storage) {
    this.storage.create();
  }

  set(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // Récupérer des données depuis le stockage local
  get(key: string): any {
    return JSON.parse(localStorage.getItem(key) || '{}');
  }

  // Supprimer une donnée du stockage local
  remove(key: string): void {
    localStorage.removeItem(key);
  }

  // Récupérer le token d'authentification
  getToken(): string {
    return localStorage.getItem('auth_token') || ''; // Exemple de récupération du token
  }
}
