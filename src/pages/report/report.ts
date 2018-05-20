import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private localNotifications: LocalNotifications) {
    // Schedule delayed notification
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ReportPage');
    this.localNotifications.schedule({
      text: 'Debut du seignement dans  une semaine',
      trigger: {at: new Date(new Date().getTime() + 60*1000)},
      led: 'FF0000',
      sound: 'file://assets/imgs/notification.mp3'
    });
  }

}
