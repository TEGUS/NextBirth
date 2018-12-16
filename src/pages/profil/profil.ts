import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {LocalStorageProvider} from '../../providers/localstorage';
import {ServiceProvider} from "../../providers/service";

import * as codesMode from "../../components/mode/mode";
import * as moment from "moment";

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
              public toastCtrl: ToastController, public navParams: NavParams, public localStorage: LocalStorageProvider, public alertCtrl: AlertController) {
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
        this.date_naissance = this.formatDate(this.user.date_naissance)
        this.debut_dernieres_menstrues = this.formatDate(this.user._embedded.patient.debut_dernieres_menstrues)
      }
    }, error => {
      console.error(error);
    });
    
    
    this.object = {
      diabete: 0,
      hta: 0,
      drepano: 0,
      age_premiere_regle: null,
      duree_saignement: null,
      duree_cycle: null,
      cycle_regulier: 0,
      douleur_regle: 0,
      nombre_grossesse: null,
      nombre_premature: null,
      nombre_fosse_couche: null,
      nombre_enfant_vivant: null,
      debut_dernieres_menstrues: null
    }
  }
  
  formatDate(date: string) {
    if (date === null) {
      return null;
    } else {
      const d = new Date(('' + date).substring(0,16)+'Z');
      return {
        day: d.getDate(),
        month: d.getMonth(),
        year: d.getFullYear(),
        date: d
      };
    }
  }
  
  dateDeDernieresRegles(date) {
    var madate = date.year + '-' + date.month + '-' + date.day + 'T19:46:57.118Z';
    this.object.debut_dernieres_menstrues = madate;
  }
  
  dateDeNaissance(date) {
    var madate = date.year + '-' + date.month + '-' + date.day + 'T19:46:57.118Z';
    this.ladate = madate;
  }
  
  getDureeSaignement(dureeSaignement) {
    this.object.duree_saignement = dureeSaignement;
  }
  
  getDureeCycle(dureeCycle) {
    this.object.duree_cycle = dureeCycle;
  }
  
  getCycleRegulier(cycleRegulier) {
    this.object.cycle_regulier = cycleRegulier;
  }
  
  getAgePremiereRegle(agePremiereRegle) {
    this.object.age_premiere_regle = agePremiereRegle;
  }
  
  getDouleur(douleurRegle) {
    this.object.douleur_regle = douleurRegle;
  }
  
  getUsername(username) {
    this.username = username;
  }
  
  getPhone(phone) {
    this.phone = phone;
  }
  
  getNombreGrossesse(nombreGrossesse) {
    this.object.nombre_grossesse = nombreGrossesse;
  }
  
  getNombrePremature(nombrePremature) {
    this.object.nombre_premature = nombrePremature;
  }
  
  getNombreFosseCouche(nombreFosseCouche) {
    this.object.nombre_fosse_couche = nombreFosseCouche;
  }
  
  getNombreEnfantVivant(nombreEnfantVivant) {
    this.object.nombre_enfant_vivant = nombreEnfantVivant;
  }
  
  checkValues() {
    return new Promise((resolve, reject) => {
      if (
        this.object.age_premiere_regle === null ||
        this.object.duree_saignement === null || this.object.duree_cycle === null ||
        this.object.nombre_grossesse === null || this.object.nombre_premature === null ||
        this.object.nombre_fosse_couche === null || this.object.nombre_enfant_vivant === null
      ) {
        reject(false)
      } else {
        resolve(true)
      }
    });
  }
  
  
  updateProfile() {
    this.checkValues().then(next => {
      this.object.diabete = this.object.diabete ? 1 : 0;
      this.object.hta = this.object.hta ? 1 : 0;
      this.object.drepano = this.object.drepano ? 1 : 0;
      this.object.douleur_regle = this.object.douleur_regle ? 1 : 0;
      this.object.douleur_regle = this.object.douleur_regle ? 1 : 0;
      this.object.cycle_regulier = this.object.cycle_regulier ? 1 : 0;
      
      this.object.account = {
        "username": this.username,
        "phone": '+237' + this.phone,
        "date_naissance": this.ladate
      };
      
      console.log(this.object);
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.updateprofile(this.object).subscribe(next => {
        console.log(next)
        this.localStorage.updatePatientStorage(next);
      }, error => {
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
        this.localStorage.getKey('modeSelected').then(mode => {
          (mode !== null) ? this.selectMode(mode) : this.navCtrl.pop();
        })
      });
    }, error => {
      let alert = this.alertCtrl.create({
        message: 'Veuillez remplir tous les champs!',
        buttons: ['Okay']
      });
      alert.present();
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
