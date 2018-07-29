import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {ServiceProvider} from "../../providers/service";

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private localNotifications: LocalNotifications,
              public loadingCtrl: LoadingController, public services: ServiceProvider
  ) {
    // Schedule delayed notification
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getArticles().subscribe(next => {
      console.log(next);
      this.items = next
    }, error => {
      loading.dismiss();
      console.error(error);
    }, () => {
      loading.dismiss();
    });

    console.log('ionViewDidLoad ReportPage');
    this.localNotifications.schedule({
      text: 'Debut du seignement dans  une semaine',
      trigger: {at: new Date(new Date().getTime() + 60*1000)},
      led: 'FF0000',
      sound: 'file://assets/imgs/notification.mp3'
    });
  }

  selectArticle(id) {
    console.log(id);
    this.navCtrl.push("ArticleDetailPage", {
      id: id
    })
  }
}
