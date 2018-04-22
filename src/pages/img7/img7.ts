import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-img7',
  templateUrl: 'img7.html',
})
export class Img7Page {

  questions = [];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    this.questions = [
      { libelle : 'Quelle est votre situation ?' },
      { libelle : 'Quelle est la fréquence de ?' },
      { libelle : 'Quelle est votre état d\'exprit ?' },
      { libelle : 'Quelle est votre profession ?' },
      { libelle : 'Depuis combien de temps cherchez vous à concevoir ?' },
      { libelle : 'Avez-vous été diagnostiqué ?' }
    ]

    console.log('ionViewDidLoad Img7Page');
  }

}
