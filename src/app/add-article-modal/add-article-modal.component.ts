import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {IonicModule, ModalController} from "@ionic/angular";

@Component({
  selector: 'app-add-article-modal',
  templateUrl: './add-article-modal.component.html',
  styleUrls: ['./add-article-modal.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule
  ]
})
export class AddArticleModalComponent  implements OnInit {

  articleForm: FormGroup;
  selectedFile: File | null = null;

  constructor(
    private modalCtrl: ModalController,
    private fb: FormBuilder
  ) {
    this.articleForm = this.fb.group({
      title: [''],
      forum_content: ['']
    });
  }

  ngOnInit(): void {
    }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit() {
    const formData = new FormData();
    formData.append('title', this.articleForm.value.title);
    formData.append('forum_content', this.articleForm.value.forum_content);
    if (this.selectedFile) {
      formData.append('media', this.selectedFile);
    }
    this.modalCtrl.dismiss(formData);
  }

  cancel() {
    this.modalCtrl.dismiss(null);
  }

}
