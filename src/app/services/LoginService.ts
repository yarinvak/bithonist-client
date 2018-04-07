import {Injectable} from "@angular/core";
import {GooglePlus} from '@ionic-native/google-plus';


@Injectable()
export class LoginService {
  constructor(private googlePlus: GooglePlus) {
    this.loginOptions = {
      webClientId: '1075460896490-snk19g31ongg2vlltpq68v5smk545s46.apps.googleusercontent.com'
    };
  }

  user: any;

  loginOptions: any;

  login = function (callback, onError) {
    this.googlePlus.login(this.loginOptions)
      .then(res => {
        this.user = res;
        callback(this.user);
      })
      .catch(err => onError(err));
  };

  silentLogin = function (callback, onError) {
    this.googlePlus.trySilentLogin(this.loginOptions)
      .then(res => {
        this.user = res;
        callback(this.user);
      })
      .catch(err => onError(err));
  };

  logout = function () {
    this.googlePlus.logout();
  }

}
