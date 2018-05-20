import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthenticationProvider} from "../../providers/authentication";
import {checkField} from "../../variables/functions";


@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  object = null;
  error = null;
  showError = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthenticationProvider, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController) {
  }

  ionViewWillLoad() {
    this.object = {
      infoEvolution: {
        dateDernieresMenstrues: null,
        dureeMenstrues: null
      },
      account: {
        nom: null,
        prenom: null,
        email: null,
        plainPassword: {
          first: null,
          second: null
        }
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  dateLastMentruation(date) {
    this.object.infoEvolution.dateDernieresMenstrues = date;
  }

  getDurationMenstruation(duree) {
    this.object.infoEvolution.dureeMenstrues = parseInt(duree)
  }

  getEmail(email) {
    this.object.account.email = email
  }

  getPassword(pwd) {
    this.object.account.plainPassword.first = pwd
  }

  getRepeatPassword(repwd) {
    this.object.account.plainPassword.second = repwd
  }

  signUp() {
    if (checkField(this.object.account.email) &&
      checkField(this.object.account.plainPassword.first) &&
      checkField(this.object.account.plainPassword.second) &&
      checkField(this.object.infoEvolution.dateDernieresMenstrues) &&
      checkField(this.object.infoEvolution.dureeMenstrues)
    ) {
      if (this.object.account.plainPassword.first === this.object.account.plainPassword.second) {
        console.log(this.object);
        let loading = this.loadingCtrl.create();
        loading.present();
        this.authProvider.signUp(this.object).subscribe(next => {
          console.log(next);
        }, error => {
          loading.dismiss();
          console.log(error);
          this.error = error.error.errors.children.account.children;
          console.log(this.error);
        }, () => {
          loading.dismiss();
          loading.onDidDismiss(() => {
            this.presentToast('Finish SignUp!');
            this.navCtrl.pop();
          });
        });
      } else {
        this.setMessageError('Les mots de passe ne sont pas identiques!')
      }
    } else {
      this.setMessageError('Veuillez remplir touts les champs!')
    }
  }

  setMessageError(message) {
    this.showError = {
      message: message
    }
    return this.showError.message;
  }

  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }
}
