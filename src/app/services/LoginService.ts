import {Injectable} from "@angular/core";
import {NativeStorage} from '@ionic-native/native-storage';
import {GooglePlus} from '@ionic-native/google-plus';


import {AngularFireAuth} from 'angularfire2/auth';
import * as firebase from 'firebase/app';

function registerInStorage(user, callback, errorCallback) {
  // NativeStorage.setItem('user', {
  //
  //   name: user.displayName,
  //   email: user.email,
  //   picture: user.imageUrl
  // })
  //   .then(function () {
  //     callback();
  //   }, function (error) {
  //     console.log("failed callback: " + error)
  //     errorCallback();
  //   });
}



@Injectable()
export class LoginService {
  constructor(public afAuth: AngularFireAuth) {

  }
  doLogin(successCallback, errorCallback) {
    var provider = new firebase.auth.GoogleAuthProvider();
    // var afAuth = AngularFireAuth;
    this.afAuth.auth.signInWithRedirect(provider).then(function () {
      return firebase.auth().getRedirectResult();
    }).then(function (result) {
      // This gives you a Google Access Token.
      // You can use it to access the Google API.
      // var token = result.credential.accessToken;
      // The signed-in user info.
      var user = result.user;
      registerInStorage(user, successCallback, errorCallback);
    }).catch(function (error) {
      // Handle Errors here.
      // var errorCode = error.code;
      // var errorMessage = error.message;
      errorCallback();
    });
  }


  doGoogleLogin(methodToCall, errorCallback) {
    // GooglePlus.login({
    //   'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
    //   'webClientId': '1075460896490-9baphsb4dufj6mbc5nt6vofj25oqmiav.apps.googleusercontent.com',
    //   // 'webClientId': '1083947780697-cisbligbu7rgdrqc4usue2kc6bb4bvl9.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
    //   'offline': false
    // })
    //   .then(function (user) {
    //     NativeStorage.setItem('user', {
    //       name: user.displayName,
    //       email: user.email,
    //       picture: user.imageUrl
    //     })
    //       .then(function () {
    //         methodToCall();
    //       }, function (error) {
    //         console.log("failed callback: " + error);
    //       })
    //   }, function (error) {
    //     errorCallback();
    //     console.log("failed connecting: " + error);
    //   });
  }

  doGoogleLogout(methodToCall) {
    // GooglePlus.logout()
    //   .then(function (response) {
    //     // NativeStorage.remove('user');
    //     methodToCall();
    //   }, function (error) {
    //     // NativeStorage.remove('user');
    //     console.log(error);
    //     methodToCall();
    //   })
    methodToCall();
  }

  getGoogleAccount() {
    // return NativeStorage.getItem('user');
    return null;
  }
}
