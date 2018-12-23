import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {LocalStorageProvider} from '../../providers/localstorage';
import {ServiceProvider} from "../../providers/service";

import * as codesMode from "../../components/mode/mode";
import * as moment from "moment";
import {formatDate, formatNumberOfDate} from "../../variables/functions";

/**
 * Generated class for the ProfilsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profil',
  templateUrl: 'profil.html',
})
export class ProfilPage {
  
  public object = null;
  public error = null;
  public ladate = null;
  public dateDernieresMenstrues = null;
  public username = null;
  public phone = null;
  errorpath = null;
  errormessage = null;
  public internalerror = null;
  public internalemesage = null;
  
  modeSelectedExist = false;
  
  user = null;
  date_naissance = null;
  debut_dernieres_menstrues = null;
  
  constructor(public navCtrl: NavController, public services: ServiceProvider, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public navParams: NavParams, public localStorage: LocalStorageProvider,
              public alertCtrl: AlertController) {
  }
  
  ionViewDidLoad() {
    this.services.initHeaders();
    console.log('ionViewDidLoad ProfilsPage');
  }
  
  ionViewWillLoad() {
    this.localStorage.getKey('modeSelected').then(mode => {
      console.log(mode);
      this.modeSelectedExist = mode !== null ? true : false;
    });
    
    this.localStorage.getKey('session').then(next => {
      console.log(next);
      this.user = next.user;
      
      if (this.user !== null) {
        this.date_naissance = formatDate(this.user.date_naissance)
        this.debut_dernieres_menstrues = formatDate(this.user._embedded.patient.debut_dernieres_menstrues)
      }
    }, error => {
      console.error(error);
    });
    
    
    this.object = {
      diabete: 0,
      hta: 0,
      drepano: 0,
      agePremiereRegle: null,
      dureeSaignement: null,
      dureeCycle: null,
      cycleRegulier: 0,
      douleurRegle: 0,
      nombreGrossesse: null,
      nombrePremature: null,
      nombreFosseCouche: null,
      nombreEnfantVivant: null,
      debutDernieresMenstrues: null
    }
  }
  
  
  dateDeDernieresRegles(date) {
    this.object.debutDernieresMenstrues = `${formatNumberOfDate(date.day)}-${formatNumberOfDate(date.month)}-${date.year}`;
  }
  
  dateDeNaissance(date) {
    this.ladate = `${formatNumberOfDate(date.day)}-${formatNumberOfDate(date.month)}-${date.year}`;
  }
  
  getDureeSaignement(dureeSaignement) {
    this.object.dureeSaignement = dureeSaignement;
  }
  
  getDureeCycle(dureeCycle) {
    this.object.dureeCycle = dureeCycle;
  }
  
  getCycleRegulier(cycleRegulier) {
    this.object.cycleRegulier = cycleRegulier;
  }
  
  getAgePremiereRegle(agePremiereRegle) {
    this.object.agePremiereRegle = agePremiereRegle;
  }
  
  getDouleur(douleurRegle) {
    this.object.douleurRegle = douleurRegle;
  }
  
  getUsername(username) {
    this.username = username;
  }
  
  getPhone(phone) {
    this.phone = phone;
  }
  
  getNombreGrossesse(nombreGrossesse) {
    this.object.nombreGrossesse = nombreGrossesse;
  }
  
  getNombrePremature(nombrePremature) {
    this.object.nombrePremature = nombrePremature;
  }
  
  getNombreFosseCouche(nombreFosseCouche) {
    this.object.nombreFosseCouche = nombreFosseCouche;
  }
  
  getNombreEnfantVivant(nombreEnfantVivant) {
    this.object.nombreEnfantVivant = nombreEnfantVivant;
  }
  
  checkValues() {
    return new Promise((resolve, reject) => {
      if (
        this.object.agePremiereRegle === null ||
        this.object.dureeSaignement === null || this.object.dureeCycle === null ||
        this.object.nombreGrossesse === null || this.object.nombrePremature === null ||
        this.object.nombreFosseCouche === null || this.object.nombreEnfantVivant === null ||
        this.username === '' || this.username === null || this.phone === '' || this.phone === null
      ) {
        reject(false)
      } else {
        resolve(true)
      }
    });
  }
  
  
  checkErrorPossibilities() {
    let result = {
      msg: '',
      error: false
    }
    
    if (this.username === this.user.email) {
      result.msg = "Le pseudonyme doit être différent de l'adresse email !";
      result.error = true;
    }
    if (this.phone === this.username) {
      result.msg = "Le numéro de téléphone doit être différent du pseudonyme !";
      result.error = true;
    }
    if (this.phone === this.user.email) {
      result.msg = "Le numéro de téléphone doit être différent de l'adresse email !";
      result.error = true;
    }
    
    return result;
  }
  
  
  updateProfile() {
    if(this.checkErrorPossibilities().error) {
      this.presentToast(this.checkErrorPossibilities().msg)
      return;
    }
    
    this.checkValues().then(next => {
      this.object.diabete = this.object.diabete ? 1 : 0;
      this.object.hta = this.object.hta ? 1 : 0;
      this.object.drepano = this.object.drepano ? 1 : 0;
      this.object.douleurRegle = this.object.douleurRegle ? 1 : 0;
      this.object.douleurRegle = this.object.douleurRegle ? 1 : 0;
      this.object.cycleRegulier = this.object.cycleRegulier ? 1 : 0;
      
      this.object.account = {
        username: this.username,
        phone: this.phone,
        dateNaissance: this.ladate
      };
      
      console.log(this.object);
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.updateprofile(this.object).subscribe(next => {
        console.log(next)
        this.localStorage.updatePatientStorage(next);
      }, error => {
        console.error(error);
        loading.dismiss();
        
        if (undefined != error.error[0]) {
          this.errorpath = error.error[0].property_path;
          this.errormessage = error.error[0].message;
        } else {
          this.internalerror = 1;
          this.presentToast(error.error.message);
          this.internalemesage = error.error.message;
        }
        
      }, () => {
        loading.dismiss();
        this.presentToast('Mise à jour effectué !');
        
        this.localStorage.setObjectUpdateProfile(this.object);
        
        this.localStorage.getKey('modeSelected').then(mode => {
          (mode !== null) ? this.selectMode(mode) : this.navCtrl.pop();
        });
      });
    }, error => {
      this.presentToast('Veuillez remplir tous les champs!')
    })
  }
  
  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }
  
  selectMode(mode) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.selectMode(mode.id).subscribe(resp => {
      console.log(resp);
    }, error => {
      loading.dismiss();
    }, () => {
      loading.dismiss();
      loading.onDidDismiss(() => {
        this.localStorage.removeKey('modeSelected');
        this.localStorage.setKey("mode", mode);
        
        switch (mode.code) {
          case codesMode.CONTPL:
            this.navCtrl.setRoot("ModeContraceptionPage", {
              title: mode.intitule
            })
            break;
          case codesMode.CONTPR:
            this.navCtrl.setRoot("ModeContraceptionPage", {
              title: mode.intitule
            })
            break;
          case codesMode.GRS:
            this.navCtrl.setRoot("QuestionContraceptionPage")
            break;
          case codesMode.GEST:
            this.navCtrl.setRoot("ReportPage")
            break;
        }
      });
    });
  }
  
  
  openDialogChangePhoto() {
    let alert = this.alertCtrl.create({
      title: "Upload image",
      buttons: [
        {
          text: 'camera',
          handler: () => {
            console.log('Camera clicked');
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            console.log('Gallery clicked');
          }
        }
      ]
    });
    alert.present();
  }
}
