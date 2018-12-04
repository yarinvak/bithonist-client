import {Component, ViewChild, EventEmitter, Output} from '@angular/core';

import {NavController} from 'ionic-angular';

import {List} from 'ionic-angular';

import {LocationsService} from "../../app/services/LocationsService";

import {AlertPage} from '../map/alert'

import {Platform} from 'ionic-angular';

import {HttpClient} from '@angular/common/http';

import {AlertsService} from '../../app/services/AlertsService';
import {LoginService} from "../../app/services/LoginService";
import {ApiService} from "../../app/services/ApiService";

declare let $: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})

export class HomePage {
  @ViewChild(List) list: List;
  @Output() changeLocations = new EventEmitter();

  constructor(public navCtrl: NavController, private loginService: LoginService,
              private http: HttpClient, private locationsService: LocationsService, public alertsService: AlertsService, private api: ApiService) {
    this.http = http;
    this.loginService.silentLogin(() => {
    }, () => {
    });
    this.resolveRegions();
    this.readHistory(null);
  }

  // members
  filtered_alerts = [];
  regions: any;
  isLoading = false;

  // methods
  /**
   * Reads alerts history on refresh
   * @param refresher
   */
  public readHistory(refresher) {
    this.isLoading = true;
    let date = new Date();
    let dateString = date.getDate() + '.' + (date.getMonth() + 1) + '.' + date.getFullYear();
    let formerDateString = '01.01.' + (date.getFullYear() - 3);
    this.http.get(this.api.getConfig().alertHistoryUrl + '?lang=he&fromDate=' + formerDateString + '&toDate=' + dateString, {responseType: "text"})
      .subscribe(
        data => this.parseData(data), err => {
          // this.alerts = [];
          alert('שגיאה בקריאת היסטוריית האזעקות- בדוק את חיבור הרשת שלך, או דווח לנו על התקלה');
          this.isLoading = false;
        }, () => {
          console.log('completed reading history');
          if (refresher) refresher.complete();
          this.isLoading = false;
        }
      );
  }

  /**
   * Filters alerts by city or any string
   * @param ev
   */
  public filterAlerts(ev: any) {
    this.filtered_alerts = this.alertsService.alerts.map(x => x);
    let val = ev.target.value;
    if (val && val.trim() != '') {
      this.filtered_alerts = this.filtered_alerts.filter((item) => {
        return (item.region.toLowerCase().indexOf(val.toLowerCase()) > -1) ||
          (item.cities.filter(x => x.toLowerCase().indexOf(val.toLowerCase()) > -1).length > 0);
      });
    }
  }

  /**
   * Opens alert map
   * @param alert
   */
  public openMap(alert) {
    console.log(alert);
    this.locationsService.setAlert(alert);
    this.changeLocations.emit(null);
    this.navCtrl.push(AlertPage);
  }

  /**
   * Refresh history
   * @param refresher
   */
  public doRefresh(refresher) {
    console.log('Begin async operation', refresher);
    this.readHistory(refresher);
    setTimeout(() => {
      refresher.complete();
    }, 2000);
  }

  private resolveRegions() {
    this.http.get('assets/regions.json')
      .subscribe(data => {
        this.regions = data;
        this.readHistory(null);
      }, err => console.log(err));
  }

  /**
   * Parses the response into a list of alerts
   * @param res
   */
  private parseData(res) {
    let dom = document.createElement('html');
    dom.innerHTML = res;
    let alerts_info = dom.getElementsByTagName('li');
    let alerts = [];
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
      alerts.push({
        region: region,
        date: date,
        cities: cities,
        time: time_to_shelter,
        metadata: {
          isTrueAlert: {count: 0, voters: []},
          isIntercepted: {count: 0, voters: []},
          isDamage: {count: 0, voters: []},
          isCasualties: {count: 0, voters: []}
        }
      });
    }
    this.filtered_alerts = alerts;
    this.alertsService.setAlerts(alerts);
  }

  private getCitiesByRegionName(regionName) {
    if (this.regions) {
      let filteredRegions = this.regions.filter(x => x.region === regionName);
      if (filteredRegions.length > 0)
        return filteredRegions.map(x => x.name);
      else {
        return [regionName.replace(/[0-9]/g, '')];
      }
    }
  }

  private getTimeByRegionName(regionName) {
    if (this.regions) {
      return this.regions.filter(x => x.region === regionName).map(x => x.time)[0];
    }
  }
}
