import {Component} from '@angular/core';
import {IonicPage, LoadingController, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {AuthenticationProvider} from "../../../providers/authentication.service";
import {checkField, formatNumberOfDate} from "../../../variables/functions";
import {LocalStorageProvider} from "../../../providers/localstorage.service";


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
  
  ionViewWillEnter() {
    this.object = {
      dureeCycleMin: null,
      dureeCycleMax: null,
      debutDernieresMenstrues: null,
      dureeMenstrues: null,
      account: {
        nom: null,
        prenom: null,
        phone: null,
        plainPassword: {
          first: null,
          second: null
        },
        langue: 1,
        dateNaissance: null
      }
    }
  }
  
  ionViewDidLoad() {
  }
  
  dateNaissance(date) {
    this.object.account.dateNaissance = `${formatNumberOfDate(date.day)}-${formatNumberOfDate(date.month)}-${date.year}`;
  }
  
  dateLastMentruation(date) {
    // var madate = date.year + '-' + date.month + '-' + date.day + 'T19:46:57.118Z';
    this.object.debutDernieresMenstrues = `${formatNumberOfDate(date.day)}-${formatNumberOfDate(date.month)}-${date.year}`;
  }
  
  getDurationMenstruation(duree) {
    this.object.dureeMenstrues = parseInt(duree)
  }
  
  getDureeCycleMin(duree) {
    this.object.dureeCycleMin = duree
  }
  
  getDureeCycleMax(duree) {
    this.object.dureeCycleMax = duree
  }
  
  getPhone(phone) {
    this.object.account.phone = phone
  }
  
  getPassword(pwd) {
    this.object.account.plainPassword.first = pwd
  }
  
  getRepeatPassword(repwd) {
    this.object.account.plainPassword.second = repwd
  }
  
  signUp() {
    if (checkField(this.object.dateNaissance) &&
      checkField(this.object.account.plainPassword.first) &&
      checkField(this.object.account.plainPassword.second) &&
      checkField(this.object.debutDernieresMenstrues) &&
      checkField(this.object.dureeMenstrues)
    ) {
      if (this.object.account.plainPassword.first === this.object.account.plainPassword.second) {
        let loading = this.loadingCtrl.create();
        loading.present();
        console.log(this.object);
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
