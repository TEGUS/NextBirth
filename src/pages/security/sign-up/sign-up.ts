import {Component} from '@angular/core';
import {IonicPage, LoadingController, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthenticationProvider} from "../../../providers/authentication";
import {checkField} from "../../../variables/functions";
import {LocalStorageProvider} from "../../../providers/localstorage";


@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {


  object = null;
  error = null;
  errorpath = null;
  errormessage = null;
  showError = null;


  constructor(public navCtrl: NavController, public navParams: NavParams,
              public authProvider: AuthenticationProvider, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public mylocalstorage: LocalStorageProvider,
              public menuCtrl: MenuController) {
  }

  ionViewWillLoad() {
    this.object = {
      debut_dernieres_menstrues: null,
      duree_menstrues: null,
      account: {
        nom: null,
        prenom: null,
        email: null,
        password: null,
        repeatpass: null
      }
    }
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SignUpPage');
  }

  dateLastMentruation(date) {
    var madate = date.year + '-' + date.month + '-' + date.day + 'T19:46:57.118Z';
    this.object.debut_dernieres_menstrues = madate;
  }

  getDurationMenstruation(duree) {
    this.object.duree_menstrues = parseInt(duree)
  }

  getEmail(email) {
    this.object.account.email = email
  }

  getPassword(pwd) {
    this.object.account.password = pwd
  }

  getRepeatPassword(repwd) {
    this.object.account.repeatpass = repwd
  }

  signUp() {
    if (checkField(this.object.account.email) &&
      checkField(this.object.account.password) &&
      checkField(this.object.account.repeatpass) &&
      checkField(this.object.debut_dernieres_menstrues) &&
      checkField(this.object.duree_menstrues)
    ) {
      if (this.object.account.password === this.object.account.repeatpass) {
        let loading = this.loadingCtrl.create();
        loading.present();
        this.authProvider.signUp(this.object).subscribe(next => {
          console.log(next);
          this.mylocalstorage.storeSession(next).then(() => {
            loading.dismiss();
            loading.onDidDismiss(() => {
              this.presentToast('Finish SignUp!');
              this.navCtrl.setRoot('ChooseModePage', {});
              this.menuCtrl.enable(true, 'sideMenu');
            });
          });
        }, error => {
          loading.dismiss();
          console.log(error);
          if (error.error[0] !== undefined) {
            this.errorpath = error.error[0].property_path;
            this.errormessage = error.error[0].message;
          }
        }, () => {


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
