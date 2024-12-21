import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForumDetailPageRoutingModule } from './forum-detail-routing.module';

import { ForumDetailPage } from './forum-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForumDetailPageRoutingModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
  ],
  declarations: [ForumDetailPage],
})
export class ForumDetailPageModule {}
