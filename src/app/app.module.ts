import {NgModule, ErrorHandler} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {IonicApp, IonicModule, IonicErrorHandler} from 'ionic-angular';
import {MyApp} from './app.component';
import { HttpClientModule } from '@angular/common/http';

import {ContactPage} from '../pages/contact/contact';
import {HomePage} from '../pages/home/home';
import {TabsPage} from '../pages/tabs/tabs';
import {AngularFireModule} from 'angularfire2';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {MapComponent} from "../pages/map/map/map";
import {CommentsPage} from "../pages/map/comments/comments";
import {AlertPage} from "../pages/map/alert";
import {IonicStorageModule} from "@ionic/storage";
import {AngularFireAuthModule} from 'angularfire2/auth';
import {LocationsService} from "./services/LocationsService";
import {LoginService} from "./services/LoginService";


@NgModule({
  declarations: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    AlertPage,
    CommentsPage,
    MapComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    AngularFireModule.initializeApp({
      apiKey: "AIzaSyA8ER4RBAss-KYTGPvVxeMuZWgNtJp5UWk",
      authDomain: "bithonist-1cfa7.firebaseapp.com",
      databaseURL: "https://bithonist-1cfa7.firebaseio.com",
      projectId: "bithonist-1cfa7",
      storageBucket: "bithonist-1cfa7.appspot.com",
      messagingSenderId: "1075460896490"
    }),
    AngularFireAuthModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    ContactPage,
    HomePage,
    TabsPage,
    AlertPage,
    CommentsPage,
    MapComponent
  ],
  providers: [
    StatusBar,
    SplashScreen,
    LocationsService,
    LoginService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
