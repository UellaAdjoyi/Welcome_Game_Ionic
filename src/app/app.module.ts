import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { TabsComponent } from './tabs/tabs.component';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { InAppBrowser } from '@awesome-cordova-plugins/in-app-browser/ngx';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TaskDetailsComponent } from './task-details/task-details.component';
import { Camera } from '@ionic-native/camera/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Storage } from '@ionic/storage-angular';
import { ForumDetailPageRoutingModule } from './forum-detail/forum-detail-routing.module';
import { ForumDetailPage } from './forum-detail/forum-detail.page';
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
    InAppBrowser,
    Storage,
    Camera,
    FileTransfer,
    File,
  ],
  bootstrap: [AppComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
