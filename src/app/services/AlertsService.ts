import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Platform} from "ionic-angular";
@Injectable()
export class AlertsService {
  constructor(private platform: Platform, private http: HttpClient) {
    if (platform.is('core')) {
      this.alertsUrl = '/alerts';
    }
  }


  alertsUrl = "http://46.117.107.129:8002/alerts";

  alerts: [any];

  setAlerts = function (alertsArray) {
    this.alerts = alertsArray;
  };

  getAlerts = function () {
    return this.alerts;
  };

  getAlertMetaData = function (alert) {
    // let i = this.findAlertIndex(this.alerts, alert);
    // let trueAlert = this.alerts[i];
    // alert.metadata = trueAlert.metadata;
    this.http.post(this.alertsUrl + '/getMetadata', alert).subscribe(res => {
      alert.metadata = res;
    }, err => {
      console.log("Could not retrieve new alert metadata");
    })
  };

  updateAlert = function (alert, voter, property, add) {
    // let i = this.findAlertIndex(this.alerts, alert);
    // this.alerts[i] = alert;
    console.log(alert);
    this.http.post(this.alertsUrl+'/vote', {alert: alert, voter: voter, propertyName: property, add: add}).subscribe(res => {
    }, err => {
      console.log(err);
    });
  };

  findAlertIndex = function (alertsArray, alert) {
    let i;
    for (i = 0; i < alertsArray.length; i++) {
      let searchedAlert = alertsArray[i];
      if (searchedAlert.region === alert.region && searchedAlert.date === alert.date) {
        return i;
      }
    }
    return -1;
  }

}

