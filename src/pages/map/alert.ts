import {Component} from '@angular/core';

import {AlertController} from 'ionic-angular';

import {} from '@types/googlemaps';
import {LocationsService} from "../../app/services/LocationsService";
import {LoginService} from "../../app/services/LoginService";
import {AlertsService} from "../../app/services/AlertsService";

import {Screenshot} from '@ionic-native/screenshot';
import {SocialSharing} from '@ionic-native/social-sharing';

declare let google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'alert.html',
})

export class AlertPage {

  constructor(private popUpCtrl: AlertController,
              private locationsService: LocationsService, private loginService: LoginService, private alertsService: AlertsService, private socialSharing: SocialSharing,
              private screenshot: Screenshot) {
    this.alert = locationsService.alert;
    this.socialSharing = socialSharing;
    this.screenshot = screenshot;
  }

  viewChoose = 'map';
  cities = [];
  region = '';

  alert: any;

  /**
   * Initializes map and location
   */
  initMap() {
    if (!this.locationsService.isEquals(this.cities)) {
      this.cities = this.locationsService.alert.cities;
      this.region = this.locationsService.alert.region.replace(/[0-9]/g, '');
    }
    else
      return;
    let ilLatLong = {lat: 32.109333, lng: 34.855499};
    let map = new google.maps.Map(document.getElementById('map'), {
      zoom: 4,
      center: ilLatLong
    });
    let geocoder = new google.maps.Geocoder();
    this.searchAddress(geocoder, map, this.cities, this.region, 0, this.searchAddress);
  }

  takeShot() {
    this.screenshot.save().then((r) => {
        this.socialSharing.share(this.cities.toString(), 'אזעקה ב' + this.region, 'file://' + r.filePath).then(() => console.log('success sharing'),
          (err) => console.log('err sharing:' + err));
      }
      , (err) => console.log('error screenshot:' + err));
    // this.screenshot.URI(80).then((uri) => {
    //   this.socialSharing.share(this.cities.toString(), 'אזעקה ב' + this.region, uri.URI).then(() => console.log('success sharing'), (err) => console.log('error sharing:' + err));
    // }, () => console.log('err'));
  }

  searchAddress(geocoder, map, cities, region, i, next) {
    let country = 'ישראל';
    geocoder.geocode({'address': cities[i] + ',' + country}, function (results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        if (i == 0) { // first time
          map.setCenter(results[0].geometry.location);
          map.setZoom(10);
        }
        let marker = new google.maps.Marker({
          position: results[0].geometry.location,
          map: map,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: 'red',
            fillOpacity: .4,
            scale: Math.pow(2, 5) / 2,
            strokeColor: 'white',
            strokeWeight: .5,
          }
        });
        if ((i + 1) < cities.length)
          setTimeout(() => {
            next(geocoder, map, cities, region, i + 1, next)
          }, 10);
      }
      else if (status == google.maps.GeocoderStatus.OVER_QUERY_LIMIT) {
        setTimeout(() => {
          next(geocoder, map, cities, region, i, next)
        }, 200);
        console.log(status);
      }
      else if (status == google.maps.GeocoderStatus.ZERO_RESULTS) {
        setTimeout(() => {
          next(geocoder, map, cities, region, i + 1, next)
        }, 10);
        console.log('continue');
      }
      else {
        // setTimeout(()=> {next(geocoder,map,cities,country, i, next)},200);
        console.log(status);
      }
    });
  }

  ionViewDidEnter() {
    this.initMap();
    this.alertsService.getAlertMetaData(this.alert);
  }

  presentLoginPopup() {
    let popup = this.popUpCtrl.create({
        title: 'התחברות נדרשת',
        subTitle: 'בכדי לדווח פרטים על אזעקות עליך להתחבר לחשבון הגוגל שלך',
        buttons: [
          {
            text: 'התחבר', role: 'login', handler: () => {
            this.loginService.login(() => {
            }, (err) => {
              alert(err);
            });
          }
          },
          {
            text: 'בטל', role: 'dismiss'
          }
        ]
      })
    ;
    popup.present();
  }

  voteProperty(propertyName) {
    if (this.loginService.isLoggedIn) {
      if (this.didVote(propertyName)) {
        this.removeVote(propertyName);
        this.alertsService.updateAlert(this.alert, this.loginService.user.userId, propertyName, false);
      }
      else {
        this.addVote(propertyName);
        this.alertsService.updateAlert(this.alert, this.loginService.user.userId, propertyName, true);
      }
    }
    else {
      this.presentLoginPopup();
    }
  }

  addVote(propertyName) {
    // Updating alert metadata
    this.alert.metadata[propertyName].voters.push(this.loginService.user.userId);
    this.alert.metadata[propertyName].count++;
    // Updating alert update info for view use
    // this.alertUpdate[propertyName].voter = this.loginService.user.userId;
    // this.alertUpdate[propertyName].vote = 1; // stands for pro
  }

  removeVote(propertyName) {
    // Updating alert metadata
    this.alert.metadata[propertyName].voters = this.alert.metadata[propertyName].voters.filter(x => x != this.loginService.user.userId);
    this.alert.metadata[propertyName].count--;
    // Updating alert update info for view use
    // this.alertUpdate[propertyName].voter = this.loginService.user.userId;
    // this.alertUpdate[propertyName].vote = -1; // stands for ney
  }

  didVote(propertyName) {
    if (this.loginService.user != null && this.loginService.user.userId != null) {
      return (this.alert.metadata[propertyName].voters.filter(x => x === this.loginService.user.userId).length > 0);
    }
    else {
      return false;
    }
  }
}
