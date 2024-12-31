import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
@Component({
  selector: 'app-forum-detail',
  templateUrl: './forum-detail.page.html',
  styleUrls: ['./forum-detail.page.scss'],
})
export class ForumDetailPage implements OnInit {
  post: any;
  comments: any[] = [];
  commentForm!: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private forumService: ForumService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastController: ToastController,
    private alertController: AlertController
  ) {}

  ngOnInit() {
    const postId = +this.route.snapshot.paramMap.get('id')!;
    this.loadPost(postId);

    this.commentForm = this.formBuilder.group({
      content: ['', [Validators.required]],
    });
  }

  loadPost(id: number) {
    this.forumService.getPostById(id).subscribe(
      (data) => {
        this.post = data;
      },
      (error) => {
        console.error('Error finding post:', error);
      }
    );
  }

  addComment() {
    const postId = +this.route.snapshot.paramMap.get('id')!;

    if (this.commentForm.invalid) {
      this.commentForm.markAllAsTouched();
      return;
    }

    this.forumService
      .addComment(this.post.id, this.commentForm.value)
      .subscribe(
        (response) => {
          this.comments.push(response);
          this.commentForm.reset();
          this.loadPost(postId);
        },
        (error) => {
          console.error('Error adding comment :', error);
        }
      );
  }

  async deleteComment(comment: any) {
    const postId = +this.route.snapshot.paramMap.get('id')!;

    if (!comment.id) {
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirm',
      message: `Would you like to delete this comment??`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.forumService.deleteComment(comment.id).subscribe({
              next: () => {
                console.log('Comment deleted');
                this.comments = this.comments.filter(
                  (c) => c.id !== comment.id
                );
                this.presentToast('Comment deleted successfully');
                this.loadPost(postId);
              },
              error: (error) => {
                console.error('Error deleting comment:', error);
                this.presentToast('Error deleting the comment.');
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      position: 'bottom',
    });
    toast.present();
  }
  dismiss() {
    this.router.navigate(['/forum']);
  }
}
