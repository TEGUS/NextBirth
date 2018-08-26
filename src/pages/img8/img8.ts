import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ServiceProvider} from "../../providers/service";

@IonicPage()
@Component({
  selector: 'page-img8',
  templateUrl: 'img8.html',
})
export class Img8Page {
  items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController, public loadingCtrl: LoadingController, public services: ServiceProvider) {

    this.services.initHeaders();
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Mardi 06 Mars',
      subTitle: 'Alert Rouge',
      message: 'Message Alert',
      buttons: ['Okay']
    });
    alert.present();
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
    console.log('ionViewDidLoad Img8Page');
  }

  selectArticle(id) {
    console.log(id);
    this.navCtrl.push("ArticleDetailPage", {
      id: id
    })
  }


}
