import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { IonicModule } from '@ionic/angular';
import { SignInPageRoutingModule } from './sign-in-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SignInPage } from './sign-in.page';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SignInPageRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,

  ],
  declarations: [SignInPage]
})
export class SignInPageModule { }
