import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';

import {LoginService} from '../../app/services/LoginService';

@Component({
  selector: 'page-contact',
  templateUrl: 'contact.html',
  providers: [LoginService]
})
export class ContactPage {

  constructor(public navCtrl: NavController, public loginService: LoginService) {
    if (this.loginService.getGoogleAccount() != null)
      this.loginService.getGoogleAccount().then(data => {
        this.user = data;
        this.isLoggedOn = true;
      }, error => {
        this.user = null;
        this.isLoggedOn = false;
      });
  }

  user: any;
  isLogging = false;
  isLoggedOn: boolean;

  login() {
    this.isLogging = true;
    this.loginService.doLogin(() => {
      this.isLogging = false;
      if (this.loginService.getGoogleAccount() != null) {
        this.loginService.getGoogleAccount().then(data => {
          this.user = data;
          this.isLoggedOn = true;
        }, error => {
          this.user = null;
          this.isLoggedOn = false;
          this.isLogging = false;
          alert('ההתחברות נכשלה');

        });
      }
    }, () => {
      this.user = null;
      this.isLoggedOn = false;
      this.isLogging = false;
      alert('ההתחברות נכשלה');
    });

  }

  logout() {
    this.isLogging = true;
    this.loginService.doGoogleLogout(() => {
      this.isLogging = false;
      this.isLoggedOn = false;
      this.user = null;
    });

  }

}
