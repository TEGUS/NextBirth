import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';

/**
 * Generated class for the SendEmailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

// https://embed.plnkr.co/plunk/4l8vme Elastic Texterea.
  // https://thebrockellis.com/2017/02/22/Ionic-2-text-area-height

@IonicPage()
@Component({
  selector: 'page-send-email',
  templateUrl: 'send-email.html',
})
export class SendEmailPage {
  message = null;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendEmailPage');
  }

  submit() {
    if (this.message !== null && this.message !== '') {
      console.log(this.message);
    }
  }
}
