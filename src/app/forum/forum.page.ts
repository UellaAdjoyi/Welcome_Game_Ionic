import { Component, OnInit } from '@angular/core';
import { ForumService } from '../services/forum.service';
import { AuthService } from '../services/auth.service';
import {
  AlertController,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {
  FileTransfer,
  FileTransferObject,
} from '@ionic-native/file-transfer/ngx';
import { FileEntry } from '@ionic-native/file/ngx';
import { Router } from '@angular/router';
import { CameraResultType, CameraSource } from '@capacitor/camera';
import { File } from '@ionic-native/file/ngx';
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
    private camera: Camera,
    private file: File,
    private fileTransfer: FileTransfer
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

  takePhoto() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      correctOrientation: true,
    };

    this.camera
      .getPicture(options)
      .then((imageData) => {
        this.photo = {
          name: 'image.jpg',
          type: 'image/jpeg',
          data: 'data:image/jpeg;base64,' + imageData,
        };
        console.log('Photo taken', this.photo);
      })
      .catch((error) => {
        console.error('Error while taking photo', error);
      });
  }

  selectImage() {
    const options: CameraOptions = {
      quality: 100,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false,
      correctOrientation: true,
    };

    this.camera.getPicture(options).then(
      (imagePath) => {
        this.photos.push(imagePath); // Ajoute l'image sélectionnée au tableau
      },
      (err) => {
        console.error("Erreur lors de la sélection de l'image", err);
      }
    );
  }
}
