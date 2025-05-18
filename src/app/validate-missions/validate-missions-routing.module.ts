import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ValidateMissionsPage } from './validate-missions.page';

const routes: Routes = [
  {
    path: '',
    component: ValidateMissionsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ValidateMissionsPageRoutingModule {}
