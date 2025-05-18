import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ValidateMissionsPageRoutingModule } from './validate-missions-routing.module';

import { ValidateMissionsPage } from './validate-missions.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ValidateMissionsPageRoutingModule,
    ValidateMissionsPage
  ],
  declarations: []
})
export class ValidateMissionsPageModule {}
