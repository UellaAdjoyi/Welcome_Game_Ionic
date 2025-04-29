import { Component, OnInit } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { AuthService } from '../services/auth.service';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Camera } from '@capacitor/camera';

import { Router } from '@angular/router';
import { CameraResultType, CameraSource } from '@capacitor/camera';
@Component({
  selector: 'app-forum',
  templateUrl: './forum.page.html',
  styleUrls: ['./forum.page.scss'],
  standalone: false,
})
export class ForumPage implements OnInit {
  posts: any[] = [];
  hasEditPermissions: boolean = false;
  comments: any[] = [];
  searchQuery: string = '';
  filteredPosts: any[] = [];
  photo: any = null;
  photos: any[] = [];
  userId: string = '';

  constructor(
    private forumService: ForumService,
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController,
    private cameraResulType: CameraResultType
  ) {}

  ngOnInit() {
    this.loadPosts();
    this.authService.getProfile().subscribe((user) => {
      this.hasEditPermissions =
        user.role === 'admin' || user.role === 'moderator';
      this.userId = user.id;
    });
  }

  loadPosts() {
    this.forumService.getPosts().subscribe(
      (data) => {
        this.posts = data;
        this.filteredPosts = data;
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }

  loadPost(id: number) {
    this.forumService.getPostById(id).subscribe(
      (data) => {
        this.posts = data;
        this.comments = data.comments || []; // Comments of the post
      },
      (error) => {
        console.error('Error finding posts:', error);
      }
    );
  }

  filterPosts() {
    this.filteredPosts = this.posts.filter((post) =>
      post.title.toLowerCase().includes(this.searchQuery.toLowerCase())
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
          placeholder: 'Content',
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

            // Créer un objet FormData pour envoyer les données et l'image
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('content', data.content);

            if (this.photo) {
              // Assurez-vous que la photo est ajoutée
              formData.append('image', this.photo, this.photo.name); // Ajoute l'image à FormData
            }

            // Envoie la requête avec FormData
            this.forumService.createPostWithImage(formData).subscribe(
              (response) => {
                // Réception du post créé avec succès
                this.posts.push(response.post); // Ajouter le post à la liste locale
                this.filteredPosts.push(response.post); // Ajouter aussi à filteredPosts si nécessaire
                this.showToast('Post created successfully!');
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
    if (post.userId !== this.userId && !this.hasEditPermissions) {
      this.showToast("You don't have permission to edit this post.");
      return;
    }

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
              ...post,
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
                console.log('Post deleted');
                // Supprimer le post de la liste locale
                this.posts = this.posts.filter((e) => e.id !== post.id);
                this.filteredPosts = this.filteredPosts.filter(
                  (e) => e.id !== post.id
                ); // Si tu filtres les posts
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

  //Ajouter une image

  async takePhoto() {
    const image = await Camera.getPhoto({
      quality: 100,
      source: CameraSource.Camera,
      resultType: CameraResultType.DataUrl,
      correctOrientation: true,
    });

    this.photo = {
      name: 'image.jpg',
      type: 'image/jpeg',
      data: image.dataUrl,
    };
    console.log('Photo taken', this.photo);
  }

  async selectImage() {
    const image = await Camera.getPhoto({
      quality: 100,
      source: CameraSource.Photos,
      resultType: CameraResultType.DataUrl,
      correctOrientation: true,
    });

    this.photos.push(image.dataUrl); // Ajoute l'image sélectionnée au tableau
    console.log('Image selected', image);
  }
}
