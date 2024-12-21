import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ForumService } from '../services/forum.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
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
    private router: Router
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
        },
        (error) => {
          console.error('Error adding comment :', error);
        }
      );
  }

  dismiss() {
    this.router.navigate(['/forum']);
  }
}
