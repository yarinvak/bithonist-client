import {Component} from '@angular/core';


import {LoginService} from '../../app/services/LoginService';

import {SocialSharing} from '@ionic-native/social-sharing';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html'
})
export class ContactPage {

  constructor(private socialSharing: SocialSharing, public loginService: LoginService) {
  }


  openDeveloperPage() {
    window.open('https://play.google.com/store/apps/dev?id=8763833280417205032', '_blank', 'location=yes');
  }

  share() {
    this.socialSharing.share('הורידו עכשיו את האפליקציה החדשה שתתריע לכם על זמני כניסת השבת והחג! שווה הורדה לכל הציבור הדתי ושומר המסורת! עכשיו בחנות האפליקציות של גוגל: https://play.google.com/store/apps/details?id=com.ydev.shabbat', 'זמני כניסת שבת וחג- הורידו עכשיו!', null).then(() => console.log('success sharing'),
      (err) => console.log('err sharing:' + err));
  }

  googleLogin() {
    this.loginService.login((user) => {
    }, (err) => {
      alert(err);
    });
  }

  googleLogout() {
    this.loginService.logout();
  }

}
