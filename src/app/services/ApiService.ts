import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Platform} from "ionic-angular";

@Injectable()
export class ApiService {
  constructor(private platform: Platform, private http: HttpClient) {
    if (this.platform.is('core')) {
      this.config.alertHistoryUrl = '/api';
    }
    else {
      this.config.alertHistoryUrl = 'http://www.oref.org.il//Shared/Ajax/GetAlarms.aspx';
    }
    this.config.serverUrl = this.serverUrl;
  }

  private serverUrl = "http://46.117.107.129:8003";
  private config: { serverUrl: string, alertHistoryUrl: string } = {serverUrl: '', alertHistoryUrl: ''};

  public getConfig(): { serverUrl: string, alertHistoryUrl: string } {
    return this.config;
  }
}
