import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {ServiceProvider} from "../../../providers/metier.service";
import {LocalStorageProvider} from "../../../providers/localstorage.service";

/**
 * Generated class for the UpdatePhoneNumberPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-phone-number',
  templateUrl: 'update-phone-number.html',
})
export class UpdatePhoneNumberPage {
  object = null;
  showError = null;
  currentCallingCode = 237;
  countries = [];
  currentPhone = null;
  errorpath = null;
  errormessage = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public services: ServiceProvider, public localStorage: LocalStorageProvider) {
  }

  ionViewWillEnter() {
    this.object = {
      phone: null
    }
  }

  ionViewDidLoad() {
    this.localStorage.getCountries().then(countries => {
      console.log(countries);
      this.countries = countries;
    });
  }

  listenCode(event) {
    this.currentCallingCode = event;

    if (this.currentPhone === null)
      return;

    this.object.phone = `+${this.currentCallingCode}${this.currentPhone}`;
  }

  getPhone(phone) {
    this.currentPhone = phone;
    this.object.phone = `+${this.currentCallingCode}${phone}`;
  }

  submit() {
    if (this.object.phone === null) {
      this.setMessageError("Veuillez renseigner le numéro de téléphone!");
      return;
    }

    console.log(this.object);

    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.updatePhoneNumber(this.object).subscribe(next => {
      console.log(next);
      // this.localStorage.updatePatientStorage(next);
      loading.dismiss()
      this.navCtrl.pop();
    }, error => {
      loading.dismiss()
      console.error(error);
    });
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
