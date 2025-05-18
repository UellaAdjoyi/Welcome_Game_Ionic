import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ForumFeedDetailPageRoutingModule } from './forum-feed-detail-routing.module';

import { ForumFeedDetailPage } from './forum-feed-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ForumFeedDetailPageRoutingModule,
    ForumFeedDetailPage
  ],
  declarations: []
})
export class ForumFeedDetailPageModule {}
