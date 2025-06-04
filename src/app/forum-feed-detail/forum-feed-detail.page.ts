import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, RouterLink} from "@angular/router";
import {ForumService} from "../services/forum.service";
import {AlertController, IonicModule, ModalController, NavController, ToastController} from "@ionic/angular";
import {NgForOf, NgIf} from "@angular/common";
// @ts-ignore
import {Articles,ForumFeedResponse} from "../interfaces/articles";
import {FormsModule} from "@angular/forms";
import {AuthService} from "../services/auth.service";

@Component({
  selector: 'app-forum-feed-detail',
  templateUrl: './forum-feed-detail.page.html',
  styleUrls: ['./forum-feed-detail.page.scss'],
  imports: [
    IonicModule,
    RouterLink,
    NgForOf,
    NgIf,
    FormsModule
  ]
})
export class ForumFeedDetailPage implements OnInit {
  feedId!: number;
  ForumFeed:any;
  articles: Article[] = [];
  commentsMap: { [key: number]: any[] } = {};
  newCommentMap: { [key: number]: string } = {};
  user: any = null;


  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private toastController: ToastController,
    private alertController:AlertController,
    private navCtrl:NavController,
    private authService: AuthService,

  ) {}

  ngOnInit() {
    this.feedId = Number(this.route.snapshot.paramMap.get('id'));
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      this.user = JSON.parse(storedUser);
      console.log("User récupéré :", this.user);
    }

    this.loadFeed();
    this.loadArticles();

  }

  loadFeed() {
    this.forumService.getFeedById(this.feedId).subscribe({
      next: (res) => {
        this.ForumFeed = res;
      },
      error: (err) => {
      }
    });
  }

  loadArticles() {
    this.forumService.getArticles(this.feedId).subscribe((res:ForumFeedResponse) => {
      this.articles = res.articles;
      for (let article of this.articles) {
        this.loadComments(article.id);
      }
      /*
            console.log('Articles récupérés :', this.articles);
      */
    });
  }

  loadComments(articleId: number) {
    this.forumService.getComments(articleId).subscribe(comments => {
      this.commentsMap[articleId] = comments;
      console.log(this.commentsMap)
    });
  }

  submitComment(articleId: number) {
    const content = this.newCommentMap[articleId]?.trim();
    if (!content) return;

    this.forumService.addComment(articleId, content).subscribe(() => {
      this.newCommentMap[articleId] = '';
      this.showToast('comment added successfully');
      this.loadComments(articleId);
    });
  }

  toggleLike(comment: any) {
    this.forumService.likeComment(comment.id).subscribe(res => {
      comment.likes = res.likes;
      comment.likedByUser = !comment.likedByUser;
    });
  }

  async editArticle(article: any) {
    const alert = await this.alertController.create({
      header: 'Update Article',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Title',
          value: article.title
        },
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'Content',
          value: article.forum_content
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            if (!data.title.trim()) return false;
            this.forumService.updateArticle(article.id, {
              title: data.title,
              forum_content: data.content
            }).subscribe(() => {
              this.loadArticles();
              this.showToast('Article updated successfully');
            });
            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteArticle(articleId: number) {
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
            this.forumService.deleteArticle(articleId).subscribe((response) => {
              console.log('article deleted:', response);
              this.showToast('Article deleted successfully');
              this.loadArticles();
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      color: 'success'
    });
    toast.present();
  }

  async editComment(comment: any) {
    const alert = await this.alertController.create({
      header: 'Edit Comment',
      inputs: [
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'Content',
          value: comment.article_content
        }
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Save',
          handler: (data) => {
            if (!data.content.trim()) return false;

            this.forumService.updateComment(comment.id, { article_content: data.content })
              .subscribe(() => {
                this.loadComments(comment.article_id);
                this.showToast('Comment updated');
              });

            return true;
          }
        }
      ]
    });

    await alert.present();
  }

  async deleteComment(commentId: number) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Delete this comment?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.forumService.deleteComment(commentId).subscribe(() => {
              this.showToast('Comment deleted');
              this.loadArticles();
            });
          }
        }
      ]
    });

    await alert.present();
  }


  isCommentOwner(comment: any): boolean {
    return this.user && comment.user && comment.user.id === this.user.id;
  }



  canManageComment(comment: any): boolean {
    if (!this.user) return false;
    return this.user.role === 'admin' || this.user.role === 'moderator' || this.isCommentOwner(comment);
  }


  cancel() {
    this.navCtrl.back();
  }
}
