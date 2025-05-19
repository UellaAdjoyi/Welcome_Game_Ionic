import {AfterViewInit, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
    standalone: false
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
        console.log('Current route:', event.urlAfterRedirects);

        if (
          event.urlAfterRedirects === '/login' ||
          event.urlAfterRedirects === '/sign-in' ||
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
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        this.user = JSON.parse(storedUser);
        this.isAdmin = this.user.role === 'admin';
      } catch (e) {
        console.error(':', e);
        this.user = null;
      }
    } else {
      this.user = null;
    }

  }

  closeMenu() {
    this.menuController.close('main-menu');
  }
  ngAfterViewInit() {
    this.updateTabVisibility();
  }

  private updateTabVisibility() {
    const tabBar = document.querySelector('ion-tab-bar');
    if (tabBar) {
      if (this.hideTabs) {
        tabBar.classList.add('hide-tabs');
      } else {
        tabBar.classList.remove('hide-tabs');
      }
    }
  }

/*
  isLoginOrSignIn(): boolean {
    const currentRoute = this.router.url;
    return currentRoute.includes('login') || currentRoute.includes('signIn');
  }
*/

  logout() {
    this.authService.logout().subscribe({
      next: (response) => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_role');
        console.log('user logout successfully', response);

        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Error', error);
      },
    });
  }

  /*checkAuthentication() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      this.navCtrl.navigateRoot('/');
    }
  }*/

 /* async loadProfile() {
    try {
      const profile = await this.authService.getProfile().toPromise();
      this.user = profile.user || profile;
      this.loading = false;
    } catch (error) {
      console.error('Error loading profile:', error);
      this.loading = false;
    }
  }*/

  @ViewChild('fileInput') fileInput!: ElementRef;


  openFileChooser() {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.authService.uploadProfilePicture(file).subscribe({
        next: (res) => {
          if (res && res.profile_picture) {
            this.user.profile_picture = res.profile_picture;
            localStorage.setItem('user', JSON.stringify(this.user));
          }
        },
        error: (err) => {
          console.error(" :", err);
        }
      });
    }
  }


  getImageUrl(path: string): string {
    if (!path) return '';
    // complete link,
    if (path.startsWith('http')) {
      return path;
    }
    path = path.replace(/^\/+/, '');

    return `http://127.0.0.1:8000/${path}`;
  }



}
