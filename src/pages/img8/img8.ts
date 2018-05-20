import {Component} from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-img8',
  templateUrl: 'img8.html',
})
export class Img8Page {
  items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public alertCtrl: AlertController) {
    this.presentAlert();
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
    this.items = [
      {
        img: '/assets/imgs/background.jpg',
        label: 'Title',
        description: 'Description'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Title',
        description: 'Description'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Title',
        description: 'Description'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Title',
        description: 'Description'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Title',
        description: 'Description'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Title',
        description: 'Description'
      },
    ]
    console.log('ionViewDidLoad Img8Page');
  }

}
