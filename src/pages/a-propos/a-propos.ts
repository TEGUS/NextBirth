import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams} from 'ionic-angular';
import {contactsInfo} from "../../configs/configs";
import {CallNumber} from "@ionic-native/call-number";


/**
 * Generated class for the AProposPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-a-propos',
  templateUrl: 'a-propos.html',
})
export class AProposPage {

  constructor(private navCtrl: NavController, private navParams: NavParams, private alertCtrl: AlertController,
              private callNumber: CallNumber) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AProposPage');
  }

  contactUs() {
    let alert = this.alertCtrl.create({
      title: "Nous contacter.",
      buttons: [
        {
          text: 'Envoyer un mail',
          handler: () => this.sendEmail()
        },
        {
          text: 'Lancer un appel',
          handler: () => this.makeCall()
        }
      ]
    });
    alert.present();
  }


  /**
   * Envoyer un mail
   */
  sendEmail() {
    this.navCtrl.push('SendEmailPage')
  }

  /**
   * Faire un appel
   */
  makeCall() {
    this.callNumber.callNumber(contactsInfo.phoneNumber, true)
      .then(res => console.log('Launched dialer!', res))
      .catch(err => console.error('Error launching dialer', err));
  }
}
