import { Component, OnInit } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
  standalone: false,
})
export class ForumPage implements OnInit {
  posts: any[] = [];
  isAdmin: boolean = false;
  comments: any[] = [];

  constructor(
    private forumService: ForumService,
    private authService: AuthService,
    private router: Router,
    private modalCtrl: ModalController,
    private alertController: AlertController,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {}

  ngOnInit() {
    this.loadPosts();
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
  }

  loadPosts() {
    this.forumService.getPosts().subscribe(
      (data) => {
        this.posts = data;
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }

  loadPost(id: number) {
    this.forumService.getPostById(id).subscribe(
      (data) => {
        this.posts = data; // Post data
        this.comments = data.comments || []; // Comments of the post
      },
      (error) => {
        console.error('Error finding posts:', error);
      }
    );
  }

  navigateToCreatePost() {
    this.router.navigate(['/posts/create']);
  }

  goToDetail(postId: number) {
    this.router.navigate(['/forum-detail', postId]);
  }

  async presentCreatePostPopup() {
    const alert = await this.alertController.create({
      header: 'Create a post',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Post title',
        },
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'content',
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => console.log('Creation cancelled'),
        },
        {
          text: 'Create',
          handler: (data) => {
            if (!data.title || !data.content) {
              console.log('All fields are required.');
              return false;
            }
            this.forumService.createPost(data).subscribe(
              (response) => {
                this.showToast('Post created successfully!');
                this.posts.push(response.post); // Mettez à jour la liste localement
              },
              (error) => {
                console.error('Error creating post:', error);
                this.showToast('Failed to create the post. Please try again.');
              }
            );
            return true;
          },
        },
      ],
    });

    await alert.present();
  }

  private async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });
    await toast.present();
  }

  async presentUpdatePostPopup(post: any) {
    const alert = await this.alertController.create({
      header: 'Update the post',
      inputs: [
        {
          name: 'title',
          type: 'text',
          placeholder: 'Post title',
          value: post.title,
        },
        {
          name: 'content',
          type: 'textarea',
          placeholder: 'Content',
          value: post.content,
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Update',
          handler: (data) => {
            const updatedPost = {
              ...post, // Conserve les propriétés existantes
              title: data.title,
              content: data.content,
            };

            this.forumService.updatePost(updatedPost).subscribe(
              (response) => {
                console.log('Post updated successfully:', response);

                const index = this.posts.findIndex((p) => p.id === post.id);
                if (index !== -1) {
                  this.posts[index] = updatedPost;
                }

                this.presentToast('Post updated successfully!');
              },
              (error) => {
                console.error('Error updating post:', error);
                this.presentToast('Failed to update the post.');
              }
            );
          },
        },
      ],
    });

    await alert.present();
  }

  async deletePost(post: any) {
    console.log('Post to delete:', post);
    if (!post.id) {
      return;
    }
    const alert = await this.alertController.create({
      header: 'Confirm',
      message: `Do you want to delete the post "${post.title}" ?`,

      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.forumService.deletePost(post.id).subscribe({
              next: () => {
                console.log('Event deleted');
                this.posts = this.posts.filter((e) => e.id !== post.id);
              },
              error: (error) => {
                console.error('Error:', error);
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
}
