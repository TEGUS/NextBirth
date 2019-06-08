import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, PopoverController} from 'ionic-angular';
import {LocalStorageProvider} from '../../../providers/localstorage.service';
import {IonButtonEnd} from "../../../providers/metier.service";
import {formatDate} from "../../../variables/functions";
import {e} from "@angular/core/src/render3";

/**
 * Generated class for the MyprofilsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-profile',
  templateUrl: 'my-profile.html',
})
export class MyProfilePage {
  ionButtonsEnd: Array<IonButtonEnd> = [];
  user = null;
  patient = null;
  imageaafficher = null;
  
  constructor(public navCtrl: NavController, public localStorage: LocalStorageProvider,
              public navParams: NavParams, public popoverCtrl: PopoverController) {
  }
  
  ionViewWillEnter() {
    this.ionButtonsEnd = [
      {
        icon: 'create',
        code: 'updateProfile',
        title: 'Mise à jour du profil'
      },
      {
        icon: 'create',
        code: 'updatePassword',
        title: 'Changer le mot de passe'
      },
      {
        icon: 'create',
        code: 'updatePhoneNumber',
        title: 'Changer numéro de téléphone'
      }
    ]
    
    this.localStorage.getKey('session').then(next => {
      console.log(next);
      if (next !== undefined && next !== null) {
        this.patient = next.user._embedded.patient;
        
        if (this.patient._embedded.hasOwnProperty('account')) {
          this.user = this.patient._embedded.account;
        } else {
          this.user = next.user
        }
        
        console.log(this.user.username);
        
        this.castUsername(this.user).then(user => {
          console.log(user);
          this.user = user;
          
          if (this.user._embedded.photo !== undefined && this.user._embedded.photo !== null) {
            let photo = this.user._embedded.photo;
            this.imageaafficher = photo._embedded.url_photo
          }
        });
      }
    }, error => {
      console.error(error);
    });
  }
  
  /**
   * Cast Username
   * @param user
   */
  castUsername(user) {
    return new Promise(resolve => {
      console.log(user);
      let res = (user.username).indexOf("@nextbirth.com");
      user.username = res === -1 ? user.username : null;
      resolve(user);
    })
  }
  
  ionViewDidLoad() {
  }
  
  getClickedButton(button: IonButtonEnd) {
    switch (button.code) {
      case 'more':
        this.presentPopover(button.event);
        break;
      
      case 'updateProfile':
        this.navCtrl.push('UpdateProfilePage');
        break;
    }
  }
  
  presentPopover(event?) {
    let popover = this.popoverCtrl.create(
      'PopoverMyProfileMenu',
      {
        menu: this.ionButtonsEnd
      }
    );
    popover.present({
      ev: event
    });
    popover.onDidDismiss(data => {
      if (data !== null) {
        switch (data.code) {
          case 'updatePassword':
            this.navCtrl.push('UpdatePasswordPage');
            break;
    
          case 'updateProfile':
            this.navCtrl.push('UpdateProfilePage');
            break;

          case 'updatePhoneNumber':
            this.navCtrl.push('UpdatePhoneNumberPage');
            break;
        }
      }
    });
  }
  
  formatBool(bool: boolean) {
    return bool ? 'Oui' : 'Non';
  }
  
  formatDate(date: string) {
    let d = null;
    if (date !== null) {
      d = new Date(('' + date).substring(0, 16) + 'Z')
    }
    return d;
  }
}
