import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TabsComponent } from './tabs/tabs.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { Browser } from '@capacitor/browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { Camera } from '@capacitor/camera';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
@NgModule({
  declarations: [AppComponent, TabsComponent, TaskDetailsComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy,
    },
    Storage,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
