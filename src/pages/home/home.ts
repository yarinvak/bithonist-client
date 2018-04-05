import {Component, ViewChild, EventEmitter, Output} from '@angular/core';

import {NavController} from 'ionic-angular';

import {AlertController} from 'ionic-angular';

import {List} from 'ionic-angular';

import {LocationsService} from "../../app/services/LocationsService";

import {Storage} from '@ionic/storage';

import {AlertPage} from '../map/alert'

import {Platform} from 'ionic-angular';

import {HttpClient} from '@angular/common/http';

import {AlertsService} from '../../app/services/AlertsService';

declare let $: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})


export class HomePage {
  @ViewChild(List) list: List;
  @Output() changeLocations = new EventEmitter();

  constructor(private platform: Platform, public navCtrl: NavController, private alertCtrl: AlertController,
              private http: HttpClient, private locationsService: LocationsService, private alertsService: AlertsService) {
    if (platform.is('core')) {
      this.history_url = '/api';
    }

    this.http = http;
  }

  alerts_url = "http://www.oref.org.il/WarningMessages/Alert/alerts.json";

  history_url = "http://www.oref.org.il//Shared/Ajax/GetAlarms.aspx";
  alerts = [];
  filtered_alerts = [];
  regions: any;
  isLoading = false;

  readHistory(refresher) {
    this.isLoading = true;
    let date = new Date();
    let dateString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    this.http.get(this.history_url + '?lang=he&fromDate=01.06.2015&toDate=' + dateString, {responseType: "text"}).subscribe(
      data => this.parseData(data), err => {
        this.alerts = [];
        alert('שגיאה בקריאת היסטוריית האזעקות- בדוק את חיבור הרשת שלך, או דווח לנו על התקלה');
        this.isLoading = false;
      }, () => {
        console.log('completed reading history');
        if (refresher) refresher.complete();
        this.isLoading = false;
        this.alertsService.setAlerts(this.alerts);
      }
    );
  }

  getAlerts(ev: any) {
    this.filtered_alerts = this.alerts.map(x => x);
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.filtered_alerts = this.filtered_alerts.filter((item) => {
        return (item.region.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.cities.filter(x => x.toLowerCase().indexOf(val.toLowerCase()) > -1).length > 0);
      });
    }
  }

  parseData(res) {
    let dom = document.createElement('html');
    dom.innerHTML = res;
    let alerts_info = dom.getElementsByTagName('li');
    for (let i = 0; i < alerts_info.length; i++) {
      let dateArr = alerts_info[i].children[0].textContent.split('.');
      let hourArr = alerts_info[i].children[1].textContent.split(':');
      let day = parseInt(dateArr[0]);
      let month = parseInt(dateArr[1]) - 1;
      let year = parseInt("20" + dateArr[2]);
      let hour = parseInt(hourArr[0]);
      let minutes = parseInt(hourArr[1]);
      let region = alerts_info[i].children[2].textContent;
      let date = new Date(year, month, day, hour, minutes);
      let cities = this.getCitiesByRegionName(region);
      let time_to_shelter = this.getTimeByRegionName(region);
      this.alerts.push({region: region, date: date, cities: cities, time: time_to_shelter});
    }
    this.filtered_alerts = this.alerts;
  }

  getCitiesByRegionName(regionName) {
    if (this.regions) {
      let filteredRegions = this.regions.filter(x => x.region === regionName);
      if (filteredRegions.length > 0)
        return filteredRegions.map(x => x.name);
      else {
        return [regionName.replace(/[0-9]/g, '')];
      }
    }
  }

  getTimeByRegionName(regionName) {
    if (this.regions) {
      return this.regions.filter(x => x.region === regionName).map(x => x.time)[0];
    }
  }


  openMap(alert) {
    this.locationsService.setAlert(alert);
    // this.locationsService.cities = alert.cities;
    // this.locationsService.region = alert.region.replace(/[0-9]/g, '');
    this.changeLocations.emit(null);
    this.navCtrl.push(AlertPage);
  }

  doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.readHistory(refresher);
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  ionViewDidEnter() {
    this.http.get('assets/regions.json')
      .subscribe(data => {
        this.regions = data;
        this.readHistory(null);
      }, err => console.log(err));
  }
}
