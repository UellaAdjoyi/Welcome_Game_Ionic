import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HelppagePage } from './helppage.page';

const routes: Routes = [
  {
    path: '',
    component: HelppagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HelppagePageRoutingModule {}
