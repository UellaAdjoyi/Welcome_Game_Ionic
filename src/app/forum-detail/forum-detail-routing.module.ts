import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ForumDetailPage } from './forum-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ForumDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ForumDetailPageRoutingModule {}
