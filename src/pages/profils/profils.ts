import { Component } from '@angular/core';
import { IonicPage, NavController,AlertController, NavParams,  LoadingController, ToastController } from 'ionic-angular';
import {LocalStorageProvider} from '../../providers/localstorage';
import {ServiceProvider} from "../../providers/service";

/**
 * Generated class for the ProfilsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-profils',
  templateUrl: 'profils.html',
})
export class ProfilsPage {
  
  public object = null;
  public error = null;
  public ladate = null;
  public username = null;
  public phone = null;

  constructor(public navCtrl: NavController, public services: ServiceProvider , public loadingCtrl: LoadingController,
    public toastCtrl: ToastController, public navParams: NavParams, public mylocalstorage: LocalStorageProvider, public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilsPage');
  }

  ionViewWillLoad() {
    this.object = {
      
      poids:null,
      diabete:null,
      hta:null,
      drepano:null,
      agePremiereRegle:null,
      dureeSaignement:null,
      dureeCycle:null,
      cycleRegulier:null,
      douleurRegle:null,
      nombreGrossesse:null,
      nombrePremature:null,
      nombreFosseCouche:null,
      nombreEnfantVivant:null
    }
  }

  dateDeNaissance(date) {
    this.ladate = date;
  }

  getDureeSaignement(dureeSaignement){
    this.object.dureeSaignement = dureeSaignement;
  } 

  getDureeCycle(dureeCycle){
    this.object.dureeCycle = dureeCycle;
  } 

  getCycleRegulier(cycleRegulier){
    this.object.cycleRegulier = cycleRegulier;
  }

  getAgePremiereRegle(agePremiereRegle){
    this.object.agePremiereRegle = agePremiereRegle;
  }
  getDouleur(douleurRegle){
    this.object.douleurRegle = douleurRegle;
  }
  getUsername(username) {
    this.username = username;
  }
  getPhone(phone){
    this.phone = phone;
  }
  getAge(age){
    
  }

  getPoids(poids){
    this.object.poids = poids;
  }

  getNombreGrossesse(nombreGrossesse){
    this.object.nombreGrossesse = nombreGrossesse;
  }

  getNombrePremature(nombrePremature){
    this.object.nombrePremature = nombrePremature;
  }
  
  getNombreFosseCouche(nombreFosseCouche){
    this.object.nombreFosseCouche = nombreFosseCouche;
  }

  getNombreEnfantVivant(nombreEnfantVivant){
    this.object.nombreEnfantVivant = nombreEnfantVivant;
  }


  updateprofiles() {
    
    if(this.object.diabete){
      this.object.diabete = 1;
    }else{
      this.object.diabete = 0;
    }
    if(this.object.hta){
      this.object.hta = 1;
    }else{
      this.object.hta = 0;
    }
    if(this.object.drepano){
      this.object.drepano = 1;
    }else{
      this.object.drepano = 0;
    }
    if(this.object.douleurRegle){
      this.object.douleurRegle = 1;
    }else{
      this.object.douleurRegle = 0;
    }

    if(this.object.douleurRegle){
      this.object.douleurRegle = 1;
    }else{
      this.object.douleurRegle = 0;
    }

    if(this.object.cycleRegulier){
      this.object.cycleRegulier = 1;
    }else{
      this.object.cycleRegulier = 0;
    }
  

    this.object.account =  this.object.account = {
          "username":this.username,
          "phone":this.phone,
          "dateNaissance":this.ladate
    }


    /*this.mylocalstorage.getSession().then(result => {
    }, () => {
      
    });    */


      let loading = this.loadingCtrl.create();
      loading.present();

      this.services.updateprofile(this.object).subscribe(next => {
        var id_mode = 1;
        this.selectMode(id_mode);

      }, error => {
        loading.dismiss();
        console.log(error);
      }, () => {

        loading.dismiss();
        loading.onDidDismiss(() => {
          //this.presentToast('Finish Login!');
          
        });

      });

    console.log(this.object);
 
  }

  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 1500
    });
    toast.present();
  }

  selectMode(id_mode) {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.selectMode(id_mode).subscribe(resp => {
      
        console.log("=======================================");
        console.log(resp);
        console.log("=======================================");


    }, error => {
      loading.dismiss();
    }, () => {
      loading.dismiss();
      loading.onDidDismiss(() => {
        console.log('Succes du stochage du mode!');
      });
    });

  }

}
