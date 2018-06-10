import {Component} from '@angular/core';
import {IonicPage, NavController, AlertController, NavParams, LoadingController, ToastController} from 'ionic-angular';
import {LocalStorageProvider} from '../../providers/localstorage';
import {ServiceProvider} from "../../providers/service";
import {ModeContraceptionPage} from "../mode-contraception/mode-contraception";
import {QuestionContraceptionPage} from "../question-contraception/question-contraception";
import {Img8Page} from "../img8/img8";

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
  public username = null;
  public phone = null;

  modeSelectedExist = false;

  constructor(public navCtrl: NavController, public services: ServiceProvider, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public navParams: NavParams, public localStorage: LocalStorageProvider, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilsPage');
  }

  ionViewWillLoad() {
    this.localStorage.getKey('modeSelected').then(mode => {
      console.log(mode);
      this.modeSelectedExist = mode !== null ? true : false;
    });

    this.object = {
      poids: null,
      diabete: null,
      hta: null,
      drepano: null,
      agePremiereRegle: null,
      dureeSaignement: null,
      dureeCycle: null,
      cycleRegulier: null,
      douleurRegle: null,
      nombreGrossesse: null,
      nombrePremature: null,
      nombreFosseCouche: null,
      nombreEnfantVivant: null
    }
  }

  dateDeNaissance(date) {
    this.ladate = date;
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

  getAge(age) {

  }

  getPoids(poids) {
    this.object.poids = poids;
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


  updateProfile() {
    this.object.diabete = this.object.diabete ? 1 : 0;
    this.object.hta = this.object.hta ? 1 : 0;
    this.object.drepano = this.object.drepano ? 1 : 0;
    this.object.douleurRegle = this.object.douleurRegle ? 1 : 0;
    this.object.douleurRegle = this.object.douleurRegle ? 1 : 0;
    this.object.cycleRegulier = this.object.cycleRegulier ? 1 : 0;

    this.object.account = this.object.account = {
      "username": this.username,
      "phone": this.phone,
      "dateNaissance": this.ladate
    }

    console.log(this.object)
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.updateprofile(this.object).subscribe(next => {
      console.log(next)
    }, error => {
      loading.dismiss();
      console.log(error);
    }, () => {
      loading.dismiss();
      this.localStorage.getKey('modeSelected').then(mode => {
        (mode !== null) ? this.selectMode(mode) : this.navCtrl.pop();
      })
    });
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
        console.log('Succes du stochage du mode!');

        switch (mode.code) {
          case 'CONTPL':
            this.navCtrl.setRoot(ModeContraceptionPage, {
              title: mode.intitule
            })
            break;
          case 'CONTPR':
            this.navCtrl.setRoot(ModeContraceptionPage, {
              title: mode.intitule
            })
            break;
          case 'GRS':
            this.navCtrl.setRoot(QuestionContraceptionPage)
            break;
          case 'GEST':
            this.navCtrl.setRoot(Img8Page)
            break;
        }
      });
    });
  }
}
