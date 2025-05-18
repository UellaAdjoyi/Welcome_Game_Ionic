import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumFeedDetailPage } from './forum-feed-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ForumFeedDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumFeedDetailPageRoutingModule {}
