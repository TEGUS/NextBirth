import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-choose-mode',
  templateUrl: 'choose-mode.html',
})
export class ChooseModePage {
  modes = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewWillLoad() {
    this.modes = [
      {
        image: '/assets/imgs/background.jpg',
        libelle: 'Désir de grossesse',
        description: 'Texte'
      },
    {
        image: '/assets/imgs/background.jpg',
        libelle: 'Désir de grossesse',
        description: 'Texte'
      },
      {
        image: '/assets/imgs/background.jpg',
        libelle: 'Désir de grossesse',
        description: 'Texte'
      },
      {
        image: '/assets/imgs/background.jpg',
        libelle: 'Désir de grossesse',
        description: 'Texte'
      },
      {
        image: '/assets/imgs/background.jpg',
        libelle: 'Désir de grossesse',
        description: 'Texte'
      },
      {
        image: '/assets/imgs/background.jpg',
        libelle: 'Désir de grossesse',
        description: 'Texte'
      },
      {
        image: '/assets/imgs/background.jpg',
        libelle: 'Désir de grossesse',
        description: 'Texte'
      },
    ]
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChooseModePage');
  }

}
