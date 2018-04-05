import {Component, ViewChild} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LocationsService} from "../../../app/services/LocationsService";
import {List, Platform} from 'ionic-angular';
import {LoginService} from '../../../app/services/LoginService';

@Component({
  selector: 'comments',
  templateUrl: 'comments.html'
})

export class CommentsPage {
  @ViewChild(List) list: List;

  constructor(private platform: Platform, private locationsService: LocationsService, private http: HttpClient, public loginService: LoginService) {
    this.comment = {title: '', content: '', date: new Date(), alertDate: '', writer: '', region: ''};
    this.update = {missiles: 0, isInterecepted: false, casualtiesNumber: 0};
    if (platform.is('core')) {
      this.comments_url = '/comments';
      this.alert_info_url = '/alerts';
    }
    else {
      this.comments_url = 'http://46.117.107.129:8002/comments';
      this.alert_info_url = 'http://46.117.107.129:8002/alerts';
    }
    this.alertInfo = {missiles: 0, isIntercepted: false, casualtiesNumber: 0, isApproved: false};
    this.getAlertInfo();
    this.getComments();
    // if (this.loginService.getGoogleAccount()!=null)
    //   this.loginService.getGoogleAccount().then(data => this.user = data, error => this.user = null);
  }

  comments: any;
  comment: any;
  update: any;
  user: any;
  alertInfo: any;
  isSending = false;
  isLoading = false;
  isShowComments = false;
  isShowUpdate = false;

  comments_url: string;
  alert_info_url: string;
  errorMessage: string;

  getComments() {
    this.isLoading = true;
    this.http.post(this.comments_url + '/getComments', {
      region: this.locationsService.alert.region,
      date: this.locationsService.alert.date
    }).subscribe(
      data => {
        this.comments = data;
      }, err => {
        console.log(err);
        this.errorMessage = "שגיאה בקבלת עדכונים";
        this.isLoading = false;
      }, () => this.isLoading = false
    );
  }

  postComment() {
    if (!this.user) {
      alert('לא ניתן לשלוח תגובה. בשביל לשלוח תגובה יש צורך בחיבור אינטרנט פעיל, ובהתחברות לאפליקציה דרך גוגל');
      return;
    }
    this.comment.date = new Date();
    this.comment.alertDate = this.locationsService.alert.date;
    this.comment.writer = this.user.name;
    this.comment.region = this.locationsService.alert.region;
    this.comment.isImportant = false;
    this.isSending = true;
    this.http.post(this.comments_url, this.comment).subscribe(
      data => {
        data
      }, err => {
        alert('שגיאה בשליחת ההודעה');
        this.isSending = false;
        this.comment = {};
        this.getComments();
        this.isShowComments = false;

      }, () => {
        this.isSending = false;
        this.comment = {};
        this.getComments();
        this.isShowComments = false;
      }
    );
  }

  addComment() {
    if (!this.user) this.loginService.doLogin(() => {
      this.isShowComments = true
    }, () => {
      this.isShowComments = true;
    });
    else this.isShowComments = true;
  }

  cancelComment() {
    this.isShowComments = false;
  }

  getImportantComments(isImportant) {
    if (this.comments == undefined)
      return [];
    return this.comments.filter(x =>
      ((x.isImportant == undefined && !isImportant) || x.isImportant == isImportant)
    );
  }

  getAlertInfo() {
    this.http.post(this.alert_info_url + '/getAlertInfo', {
      region: this.locationsService.alert.region,
      date: this.locationsService.alert.date
    }).subscribe(
      data => {
        // if (data.length > 0)
        //   this.alertInfo = data[0];
      }, err => {
        console.log(err);
      }
    );
  }

  sendUpdate() {
    this.isShowUpdate = true;
  }

  postUpdate() {
    // if (!this.user) {
    //   alert('לא ניתן לשלוח עדכון. בשביל לשלוח עדכון יש צורך בחיבור אינטרנט פעיל, ובהתחברות לאפליקציה דרך גוגל');
    //   return;
    // }
    this.update.date = new Date();
    this.update.alertDate = this.locationsService.alert.date;
    this.update.writer = 'Yarin va'; // this.user.name;
    this.update.region = this.locationsService.alert.region;
    this.http.post(this.alert_info_url, this.update).subscribe(
      data => {
        data
      }, err => {
        alert('שגיאה בשליחת העדכון');
        this.isShowUpdate = false;
        this.getAlertInfo();

      }, () => {
        this.getAlertInfo();
        this.isShowUpdate = false;
      }
    );

  }
}
