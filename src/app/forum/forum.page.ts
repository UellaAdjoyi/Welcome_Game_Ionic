import { Component, OnInit } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { AuthService } from '../services/auth.service';
import {AlertController, ModalController, ToastController} from "@ionic/angular";
import {AddArticleModalComponent} from "../add-article-modal/add-article-modal.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
  standalone: false,
})
export class ForumPage implements OnInit {
  forums: any[] = [];
  user: any = null;
  private title: any;
  private description: any;
  userRole:string='';
  selectedFile: File | null = null;
  articlesByFeed: { [feedId: number]: any[] } = {};
  expandedFeeds: { [feedId: number]: boolean } = {};



  constructor(
    private forumService: ForumService,
    private authService: AuthService,
    private  alertController: AlertController,
    private modalController: ModalController,
    private router: Router,
    private toastController: ToastController,
  ) {}

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
    this.loadForums();
    this.userRole = localStorage.getItem('user_role') || '';

    this.forums.forEach(forum => {
/*
      this.loadArticles(forum.id);
*/
    });

  }

  loadForums() {
    this.forumService.getAllFeeds().subscribe((feeds) => {
      this.forums = feeds;
      this.forums.forEach(forum => {
        this.loadArticles(forum.id);
      });
    });
  }


  async presentFilePicker() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*, video/*';

    fileInput.onchange = (e: any) => {
      this.selectedFile = e.target.files[0];
    };

    fileInput.click();
  }

  async addArticle(feedId: number) {
    const modal = await this.modalController.create({
      component: AddArticleModalComponent,
    });
    await modal.present();

    const { data: formData } = await modal.onDidDismiss();
    if (formData) {
      this.forumService.addArticle(feedId, formData).subscribe(
        res => {
          console.log('Article added', res);
          this.showToast('Article added successfully');
          this.loadForums();
        },
        err => {
          console.error('Erreur', err);
          this.showToast('Error adding the article.');
        }
      );
    }
  }

  async updateFeed(forum: any) {
    const alert = await this.alertController.create({
      header: 'Update Forum feed',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title',
          value: forum.title
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description',
          value: forum.description
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Update',
          handler: (data) => {
            if (!data.title.trim()) {
              return false;
            }

            this.forumService.updateForumFeed(forum.id, {
              title: data.title,
              description: data.description
            }).subscribe({
              next: () => {
                forum.title = data.title;
                forum.description = data.description;
                this.showToast('Feed updated successfully');
              },
              error: (err) => {
                console.error('Error', err);
                this.showToast('Error updating the feed.');
              }
            });
            return true;
          }

        }
      ]
    });

    await alert.present();
  }

  async deleteFeed(id: number) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure you want to delete this feed?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.forumService.deleteFeed(id).subscribe((response) => {
              console.log('Feed deleted:', response);
              this.showToast('Feed  deleted successfully');
              this.loadForums();
            });
          }
        }
      ]
    });

    await alert.present();
  }
  async createFeed() {
    const alert = await this.alertController.create({
      header: 'Create Forum feed',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Feed title',
          value: this.title,
        },
        {
          name: 'description',
          type: 'textarea',
          placeholder: 'Description ',
          value: this.description,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Action cancelled');
          },
        },
        {
          text: 'Create',
          handler: (data) => {
            if (data.title && data.description) {
              this.forumService.createFeed({ title: data.title, description: data.description }).subscribe(
                (response) => {
                  this.showToast('Forum feed created successfully');
                  this.loadForums();
                },
                (error) => {
                  console.error('Error creating forrum feed:', error);
                  this.showToast('Error creating the forum feed.');
                }
              );
            } else {
              this.showToast('All fields are required');
            }
          },
        },
      ],
    });

    await alert.present();
  }

  loadArticles(feedId: number) {
    this.forumService.getArticles(feedId).subscribe((articles) => {
      this.articlesByFeed[feedId] = articles;
    });
  }

  toggleArticles(feedId: number) {
    const isExpanded = this.expandedFeeds[feedId];
    this.expandedFeeds[feedId] = !isExpanded;

    if (!isExpanded && !this.articlesByFeed[feedId]) {
      this.loadArticles(feedId);
    }
  }

  goToForumFeedDetail(id: number) {
    this.router.navigate(['/forum-feed-detail', id]);
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }


}
