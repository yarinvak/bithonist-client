import {Injectable} from "@angular/core";
// import {GooglePlus} from '@ionic-native/google-plus';


@Injectable()
export class LoginService {
  constructor() {
    this.loginOptions = {
      // webClientId: '1075460896490-9baphsb4dufj6mbc5nt6vofj25oqmiav.apps.googleusercontent.com'
    };
  }

  user: any;

  loginOptions: any;

  // login = function (callback, onError) {
  //   this.googlePlus.login(this.loginOptions)
  //     .then(res => {
  //       this.user = res;
  //       callback(this.user);
  //     })
  //     .catch(err => onError(err));
  // };
  //
  // silentLogin = function (callback, onError) {
  //   this.googlePlus.trySilentLogin(this.loginOptions)
  //     .then(res => {
  //       this.user = res;
  //       callback(this.user);
  //     })
  //     .catch(err => onError(err));
  // };
  //
  // logout = function () {
  //   this.googlePlus.logout();
  // }

}
