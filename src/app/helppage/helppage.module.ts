import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HelppagePageRoutingModule } from './helppage-routing.module';

import { HelppagePage } from './helppage.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HelppagePageRoutingModule
  ],
  declarations: [HelppagePage]
})
export class HelppagePageModule {}
