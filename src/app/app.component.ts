import { AfterViewInit, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import {
  AlertController,
  MenuController,
  NavController,
  ToastController,
} from '@ionic/angular';
import { Platform } from '@ionic/angular';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnInit {
  hideTabs: boolean = false;
  user: any = null; //store user information
  loading = true;
  isAdmin: boolean = false;

  constructor(
    private router: Router,
    private navCtrl: NavController,
    private authService: AuthService,
    private menuController: MenuController
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        console.log('Current route:', event.urlAfterRedirects); // Vérifie l'URL actuelle

        if (
          event.urlAfterRedirects === '/login' ||
          event.urlAfterRedirects === '/sign-in' ||
          event.urlAfterRedirects === '/forgot-password' ||
          event.urlAfterRedirects === '/verify-email' ||
          event.urlAfterRedirects === '/reset-password'
        ) {
          this.hideTabs = true; // hide
        } else {
          this.hideTabs = false; // show  tab bar
        }

        console.log('Hide Tabs:', this.hideTabs);
        this.updateTabVisibility();
      }
    });
  }

  ngOnInit() {
    this.authService.getProfile().subscribe(
      (user) => {
        console.log('User profile loaded:', user);
        this.isAdmin = user.role === 'admin';
        console.log('isAdmin:', this.isAdmin);
      },
      (error) => {
        console.error('Error:', error);
      }
    );
    this.loadProfile();
  }

  closeMenu() {
    this.menuController.close('main-menu'); // Ferme le menu ayant l'ID "main-menu"
  }
  ngAfterViewInit() {
    this.updateTabVisibility();
  }

  private updateTabVisibility() {
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      if (this.hideTabs) {
        tabBar.classList.add('hide-tabs'); // Ajouter la classe pour masquer la tab bar
      } else {
        tabBar.classList.remove('hide-tabs'); // Retirer la classe pour afficher la tab bar
      }
    }
  }

  isLoginOrSignIn(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('login') || currentRoute.includes('signIn');
  }

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        console.log('Déconnecté avec succès', response);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Erreur lors de la déconnexion', error);
      },
    });
  }

  checkAuthentication() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.navCtrl.navigateRoot('/');
    }
  }

  async loadProfile() {
    try {
      const profile = await this.authService.getProfile().toPromise();
      console.log('User profile loaded:', profile);
      this.user = profile.user || profile;
      this.loading = false;
    } catch (error) {
      console.error('Error loading profile:', error);
      this.loading = false;
    }
  }
}
