import {Injectable} from "@angular/core";
@Injectable()
export class AlertsService {
  alerts: [any];

  setAlerts = function (alertsArray) {
    this.alerts = alertsArray;
  };

  getAlerts = function () {
    return this.alerts;
  };

  getAlertMetaData = function (alert) {
    let i = this.findAlertIndex(this.alerts, alert);
    let trueAlert = this.alerts[i];
    alert.metadata = trueAlert.metadata;
  };

  updateAlert = function (alert) {
    let i = this.findAlertIndex(this.alerts, alert);
    this.alerts[i] = alert;
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

