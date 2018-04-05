import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';

import {} from '@types/googlemaps';
import {LocationsService} from "../../app/services/LocationsService";

// import {Screenshot, GooglePlus, NativeStorage} from 'ionic-native';
// import {SocialSharing} from 'ionic-native';

declare let google: any;

@Component({
  selector: 'page-map',
  templateUrl: 'alert.html',
})

export class AlertPage {

  constructor(public navCtrl: NavController,
              private locationsService: LocationsService) {

  }

  viewChoose = 'map';
  cities = [];
  region = '';

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
    // Screenshot.save().then((r) => {
    //     SocialSharing.share(this.cities.toString(), 'אזעקה ב' + this.region, 'file://' + r.filePath).then(() => console.log('success sharing'),
    //       (err) => console.log('err sharing:' + err));
    //   }
    //   , (err) => console.log('error screenshot:' + err));
    // Screenshot.URI(80).then((uri) => {
    //   SocialSharing.share(this.cities.toString(), 'אזעקה ב' + this.region, uri.URI).then(() => console.log('success sharing'), (err) => console.log('error sharing:'+err));
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
  }


}
