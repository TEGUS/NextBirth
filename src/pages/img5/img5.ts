import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-img5',
  templateUrl: 'img5.html',
})
export class Img5Page {

  items = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillLoad() {
    this.items = [
      {
        img: '/assets/imgs/background.jpg',
        label: 'Les 20 bases d\'une conception',
        description: 'Texte'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Les 20 bases d\'une conception',
        description: 'Texte'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Les 20 bases d\'une conception',
        description: 'Texte'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Les 20 bases d\'une conception',
        description: 'Texte'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Les 20 bases d\'une conception',
        description: 'Texte'
      },
      {
        img: '/assets/imgs/background.jpg',
        label: 'Les 20 bases d\'une conception',
        description: 'Texte'
      },
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Img5Page');
  }

}
