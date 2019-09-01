import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ToastController} from 'ionic-angular';
import { ServiceProvider } from '../../../providers/metier.service';

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
  email = null;

  constructor(public navCtrl: NavController, public toastCtrl: ToastController, public services: ServiceProvider, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SendEmailPage');
  }

  submit() {
    if (this.message !== null && this.message !== '') {
      console.log(this.message);

      var email = {
        "object": "Contact nextbith",
        "content": this.message,
        "email": this.email
      }
      

      this.services.sendMail(email).subscribe(mode => {
           this.presentToast("Opération éffectué avec succès");
           this.message="";
      }, error => {
           this.presentToast("Echec de l'opération");
      });


    }
  }


  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }
}
