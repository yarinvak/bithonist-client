import {Injectable} from "@angular/core";
import {GooglePlus} from '@ionic-native/google-plus';


@Injectable()
export class LoginService {
  constructor(private googlePlus: GooglePlus) {
    this.isLoggedIn = false;
    this.loginOptions = {
      webClientId: '1075460896490-snk19g31ongg2vlltpq68v5smk545s46.apps.googleusercontent.com'
    };
  }

  user: any;
  isLoggedIn: Boolean;

  loginOptions: any;

  login = function (callback, onError) {
    this.googlePlus.login(this.loginOptions)
      .then(res => {
        this.user = res;
        this.isLoggedIn = true;
        callback(this.user);
      })
      .catch(err => onError(err));
  };

  silentLogin = function (callback, onError) {
    this.googlePlus.trySilentLogin(this.loginOptions)
      .then(res => {
        this.user = res;
        this.isLoggedIn = true;
        callback(this.user);
      })
      .catch(err => onError(err));
  };

  logout = function () {
    this.googlePlus.logout();
    this.isLoggedIn = false;
    this.user = null;
  }

}
