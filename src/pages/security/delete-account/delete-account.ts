import { Component } from '@angular/core';
import {IonicPage, LoadingController, MenuController, NavController, NavParams, ToastController} from 'ionic-angular';
import {ServiceProvider} from "../../../providers/metier.service";
import {LocalStorageProvider} from "../../../providers/localstorage.service";
import {handleError} from "../../../variables/functions";

/**
 * Generated class for the DeleteAccountPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-delete-account',
  templateUrl: 'delete-account.html',
})
export class DeleteAccountPage {
  password = null;
  error = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public services: ServiceProvider,
              public toastCtrl: ToastController, public localStorage: LocalStorageProvider,
              public menuCtrl: MenuController) {
  }

  ionViewDidLoad() {
  }
  
  getPassword(pwd) {
    this.password = pwd
  }
  
  submit() {
    this.error = null;
    if (this.password !== null && this.password !== "") {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.deleteAccount(this.password).subscribe(next => {
        console.log(next);
    
        this.presentToast('Compte supprimé avec succès! \nAurevoir.');
    
        this.localStorage.clearStorage().then(next => {
          this.menuCtrl.enable(false);
          this.navCtrl.setRoot("LoginPage");
        }, error => {
          console.log(error);
        })
      }, error => {
        if (handleError(error) === 0) {
          this.navCtrl.setRoot('ErrorPage');
        }
        
        loading.dismiss();
        console.error(error);
        this.error = error.error.message;
      }, () => {
        loading.dismiss();
      });
    } else {
      this.error = "Veuillez renseigner le mot de passe!"
    }
  }
  
  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}
