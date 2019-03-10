import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {checkField} from "../../../variables/functions";
import {ServiceProvider} from "../../../providers/metier.service";

/**
 * Generated class for the UpdatePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-password',
  templateUrl: 'update-password.html',
})
export class UpdatePasswordPage {
  object = null;
  showError = null;
  errorpath = null;
  errormessage = null;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public toastCtrl: ToastController,
              public services: ServiceProvider) {
  }
  
  ionViewWillEnter() {
    this.object = {
      current_password: null,
      plainPassword: {
        first: null,
        second: null
      }
    }
  }
  
  getCurrentPassword(cpwd) {
    this.object.current_password = cpwd
  }
  
  getPassword(pwd) {
    this.object.plainPassword.first = pwd
  }
  
  getRepeatPassword(repwd) {
    this.object.plainPassword.second = repwd
  }
  
  submit() {
    if (checkField(this.object.current_password) &&
      checkField(this.object.plainPassword.first) &&
      checkField(this.object.plainPassword.second)
    ) {
      if (this.object.current_password !== this.object.plainPassword.first) {
        if (this.object.plainPassword.first === this.object.plainPassword.second) {
          let loading = this.loadingCtrl.create();
          loading.present();
          console.log(this.object);
          this.services.changePassword(this.object).subscribe(next => {
            console.log(next);
            this.presentToast("Modification du mot de passe effectué!")
            this.navCtrl.pop();
            loading.dismiss()
          }, error => {
            console.error(error)
            if (error.error[0] !== undefined) {
              this.errorpath = error.error[0].property_path;
              this.errormessage = error.error[0].message;
            }
            loading.dismiss()
          })
        } else {
          this.setMessageError('Les mots de passe ne sont pas identiques!')
        }
      } else {
        this.setMessageError('L\'ancien mot de passe doit être différent du nouveau !')
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
