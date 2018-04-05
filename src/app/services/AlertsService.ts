import {Injectable} from "@angular/core";
@Injectable()
export class AlertsService {
  alerts: [any];

  setAlerts = function (alertsArray) {
    this.alerts = alertsArray;
  }

  getAlerts = function () {
    return this.alerts;
  }
}
