import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  MenuController,
  NavController,
  NavParams,
  ToastController
} from 'ionic-angular';
import {AuthenticationProvider} from "../../../providers/authentication.service";
import {checkField, formatNumberOfDate, handleError} from "../../../variables/functions";
import {LocalStorageProvider} from "../../../providers/localstorage.service";
import {ServiceProvider} from '../../../providers/metier.service';


@IonicPage()
@Component({
  selector: 'page-sign-up',
  templateUrl: 'sign-up.html',
})
export class SignUpPage {
  object: ObjectSignup = null;
  error = null;
  errorpath = null;
  errormessage = null;
  showError = null;
  errorObject = null;

  errorSignup: ErrorSignup = {};
  maxYear = null;
  minYear = null;

  countries = [];
  currentCallingCode = 237;
  currentPhone = null;

  constructor(private navCtrl: NavController, private services: ServiceProvider, private navParams: NavParams,
              private authProvider: AuthenticationProvider, private loadingCtrl: LoadingController,
              private toastCtrl: ToastController, private mylocalstorage: LocalStorageProvider,
              private menuCtrl: MenuController, private alertCtrl: AlertController) {
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

    this.maxYear = (new Date()).getFullYear() - 12;
    this.minYear = (new Date()).getFullYear() - 60;

    this.mylocalstorage.getCountries().then(countries => {
      this.countries = countries;
    });
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
    if (parseInt(duree) < 0) {
      this.errorSignup.dureeMenstrues = "La durée des menstruation doit être supérieur à 0."
      return;
    }
    this.object.dureeMenstrues = parseInt(duree)
  }

  getDureeCycleMin(duree) {
    if (parseInt(duree) < 0) {
      this.errorSignup.dureeCycleMin = "La durée du cycle minimum doit être supérieur à 0."
      return;
    }
    this.object.dureeCycleMin = parseInt(duree)
  }

  getDureeCycleMax(duree) {
    if (parseInt(duree) < 0) {
      this.errorSignup.dureeCycleMax = "La durée du cycle maximum doit être supérieur à 0."
      return;
    }
    this.object.dureeCycleMax = parseInt(duree)
  }

  getPhone(phone) {
    this.currentPhone = phone;
    this.object.account.phone = `+${this.currentCallingCode}${phone}`;
  }

  listenCode(event) {
    this.currentCallingCode = event;

    if (this.currentPhone === null)
      return;

    this.object.account.phone = `+${this.currentCallingCode}${this.currentPhone}`;
  }

  getPassword(pwd) {
    this.object.account.plainPassword.first = pwd
  }

  getRepeatPassword(repwd) {
    this.object.account.plainPassword.second = repwd
  }

  /**
   * Get and Check Code From SMS
   */
  getCodeSmsAlert() {
    let alert = this.alertCtrl.create({
      title: 'Bien vouloir saisir le code reçu par SMS !',
      inputs: [
        {
          name: 'code',
          type: 'text',
          placeholder: 'Tappez ici le code...'
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Valider',
          handler: data => {
            if (data.code === null || data.code === '') {
              this.presentToast('Veuillez renseigner le code.');
              this.getCodeSmsAlert();
              return;
            }

            let loading = this.loadingCtrl.create();
            loading.present();
            this.authProvider.confirmRegisterCode({
              confirmationCode: data.code,
              phone: this.object.account.phone,
            }).subscribe(next => {
              console.log(next);
              loading.dismiss();
              this.mylocalstorage.storeSession(next).then(() => {
                this.services.faitTravail().then(() => {
                  this.presentToast('L\'inscription réussit!');
                  this.navCtrl.setRoot('ChooseModePage', {});
                  this.menuCtrl.enable(true, 'sideMenu');
                });
              });
            }, error => {
              console.error(error);
              loading.dismiss();

              if (handleError(error) === 0) {
                this.navCtrl.setRoot('ErrorPage');
              }

              if (error.status === 400) {
                this.presentToast('Code invalide !');
                this.getCodeSmsAlert();
              }
            });

          }
        }
      ],
      enableBackdropDismiss: false
    });
    alert.present({
      keyboardClose: false
    });
  }

  signUp() {
    if (checkField(this.object.account.dateNaissance) &&
      checkField(this.object.account.plainPassword.first) &&
      checkField(this.object.account.plainPassword.second) &&
      checkField(this.object.debutDernieresMenstrues) &&
      checkField(this.object.dureeMenstrues)
    ) {
      if (this.object.account.plainPassword.first === this.object.account.plainPassword.second) {
        if (this.object.dureeCycleMin > this.object.dureeCycleMax) {
          this.presentToast('La durée minimal doit être inférieur ou égale à la durée maximale du cycle.');
          return;
        }

        let loading = this.loadingCtrl.create();
        loading.present();
        console.log(this.object);
        this.authProvider.signUp(this.object).subscribe(next => {
          console.log(next);
          loading.dismiss();
          this.getCodeSmsAlert();
        }, error => {
          if (handleError(error) === 0) {
            this.navCtrl.setRoot('ErrorPage');
          }

          loading.dismiss();
          this.errorObject = error.error.errors;
          console.log(this.errorObject);
          this.buildError();
        });
      } else {
        //this.setMessageError('Les mots de passe ne sont pas identiques!')
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

  buildError() {
    this.errorSignup = {};

    if (this.errorObject.hasOwnProperty('account')) {
      if (this.errorObject.account.hasOwnProperty('dateNaissance')) {
        this.errorSignup.dateNaissance = this.errorObject.account.dateNaissance[0];
      }
      if (this.errorObject.account.hasOwnProperty('plainPassword')) {
        this.errorSignup.firstPassword = this.errorObject.account.plainPassword.first[0];
      }
      if (this.errorObject.account.hasOwnProperty('phone')) {
        this.errorSignup.phone = this.errorObject.account.phone[0];
      }
    }

    if (this.errorObject.hasOwnProperty('dureeCycleMin')) {
      this.errorSignup.dureeCycleMin = this.errorObject.dureeCycleMin[0];
    }
    if (this.errorObject.hasOwnProperty('dureeCycleMax')) {
      this.errorSignup.dureeCycleMax = this.errorObject.dureeCycleMax[0];
    }
    if (this.errorObject.hasOwnProperty('debutDernieresMenstrues')) {
      this.errorSignup.debutDernieresMenstrues = this.errorObject.debutDernieresMenstrues[0];
    }
    if (this.errorObject.hasOwnProperty('dureeMenstrues')) {
      this.errorSignup.dureeMenstrues = this.errorObject.dureeMenstrues[0];
    }

    console.log(this.errorSignup);
  }
}

interface ErrorSignup {
  dateNaissance?: any,
  phone?: any,
  firstPassword?: any,
  dureeCycleMin?: any,
  dureeCycleMax?: any,
  debutDernieresMenstrues?: any,
  dureeMenstrues?: any,
}

interface ObjectSignup {
  dureeCycleMin: any,
  dureeCycleMax: any,
  debutDernieresMenstrues: any,
  dureeMenstrues: any,
  account: {
    nom: any,
    prenom: any,
    phone: any,
    plainPassword: {
      first: any,
      second: any
    },
    langue: 1,
    dateNaissance: any
  }
}
