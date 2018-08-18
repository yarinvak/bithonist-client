import {Component} from '@angular/core';
import {Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
// import {Vibration} from '@ionic-native/vibration';
import {TabsPage} from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage: any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();

      ///ONESIGNAL

      let notificationOpenedCallback = function (jsonData) {
        console.log('notificationOpenedCallback: ' + JSON.stringify(jsonData));
        // Vibration.vibrate(1000);
      };
      if (window["plugins"]) {
        console.log(window["plugins"]);
        window["plugins"].OneSignal
          .startInit("482b9bc7-68a6-4e85-a6bd-54f65618b3bf", "1075460896490")
          .handleNotificationOpened(notificationOpenedCallback)
          .endInit();
      }
    });
  }
}
