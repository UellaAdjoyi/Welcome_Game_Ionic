import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {ForumFeedDetailPage} from "../forum-feed-detail/forum-feed-detail.page";

import { ForumPage } from './forum.page';

const routes: Routes = [
  {
    path: '',
    component: ForumPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumPageRoutingModule {}
