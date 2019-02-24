import {Component} from '@angular/core';
import {
  IonicPage,
  NavController,
  AlertController,
  NavParams,
  LoadingController,
  ToastController,
  Platform
} from 'ionic-angular';
import {LocalStorageProvider} from '../../../providers/localstorage.service';
import {ServiceProvider} from "../../../providers/metier.service";

import * as codesMode from "../../../components/mode/mode";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Base64} from '@ionic-native/base64';
import * as moment from "moment";
import {formatDate, formatNumberOfDate} from "../../../variables/functions";

/**
 * Generated class for the ProfilsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-update-profile ',
  templateUrl: 'update-profile.html',
})
export class UpdateProfilePage {
  
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
  public imageaafficher = null;
  
  modeSelectedExist = false;
  
  imageB64 = null;
  images = {
    "image": ""
  }
  
  patient = null;
  user = null;
  date_naissance = null;
  debut_dernieres_menstrues = null;
  date_vaccin_anti_tetanique = null;
  
  constructor(public navCtrl: NavController, public mylocalstorage: LocalStorageProvider, private base64: Base64,
              private camera: Camera, public services: ServiceProvider, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public navParams: NavParams, public localStorage: LocalStorageProvider,
              public alertCtrl: AlertController, public platform: Platform) {
  }
  
  ionViewDidLoad() {
    this.services.initHeaders();
  }
  
  ionViewWillEnter() {
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
      dateVaccinAntiTetanique: null,
      debutDernieresMenstrues: null
    };
    
    this.localStorage.getKey('modeSelected').then(mode => {
      console.log(mode);
      this.modeSelectedExist = mode !== null ? true : false;
    });
    
    this.localStorage.getKey('session').then(next => {
      console.log(next);
      if (next !== undefined && next !== null) {
        this.patient = next.user._embedded.patient;
        
        if (this.patient._embedded.hasOwnProperty('account')) {
          this.user = this.patient._embedded.account;
        } else {
          this.user = next.user
        }
        
        this.castUsername(this.user).then(user => {
          this.user = user;
        });
        
        this.date_naissance = formatDate(this.user.date_naissance);
        this.debut_dernieres_menstrues = formatDate(this.patient.debut_dernieres_menstrues)
        
        if (this.user._embedded.photo !== undefined && this.user._embedded.photo !== null) {
          let photo = this.user._embedded.photo;
          this.imageaafficher = photo._embedded.url_photo
        }
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
      let res = (user.username).split('@nextbirth.com');
      user.username = res.length === 0 ? user.username : null;
      resolve(user);
    })
  }
  
  
  dateDeDernieresRegles(date) {
    this.object.debutDernieresMenstrues = `${formatNumberOfDate(date.day)}-${formatNumberOfDate(date.month)}-${date.year}`;
  }
  
  DateVaccinAntitetanique(date) {
    this.object.dateVaccinAntiTetanique = `${formatNumberOfDate(date.day)}-${formatNumberOfDate(date.month)}-${date.year}`;
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

    if (this.checkErrorPossibilities().error) {
      this.presentToast(this.checkErrorPossibilities().msg)
      return;
    }
    
    this.checkValues().then(next => {
      this.object.diabete = this.object.diabete ? true : false;
      this.object.hta = this.object.hta ? true : false;
      this.object.drepano = this.object.drepano ? true : false;
      this.object.douleurRegle = this.object.douleurRegle ? true : false;
      this.object.douleurRegle = this.object.douleurRegle ? true : false;
      this.object.cycleRegulier = this.object.cycleRegulier ? true : false;
      
      this.object.account = {
        username: this.username,
        phone: this.phone,
        dateNaissance: this.ladate
      };
      
      console.log(this.object);
      
      let loading = this.loadingCtrl.create();
      loading.present();
      
      console.log("============================================");
      console.log(this.object);
      console.log("============================================");
      
      this.services.updateprofile(this.object).subscribe(next => {
        console.log(next)
        this.localStorage.updatePatientStorage(next);
        
        if (this.images.image != "") {
          this.services.editImage(this.images).subscribe(next => {
          }, error => {
          }, () => {
          })
        }
      }, error => {
        console.error(error.error.errors);
        loading.dismiss();
        
        if (undefined != error.error.errors) {
          this.errorpath = error.error.errors;
          // this.errormessage = error.error[0].message;
          
          if (this.errorpath.hasOwnProperty('account')) {
            if (this.errorpath.account.hasOwnProperty('debut_dernieres_menstrues')) {
              this.presentToast("DDR : " + this.errorpath.account.debut_dernieres_menstrues[0])
            }
            
            if (this.errorpath.account.hasOwnProperty('date_naissance')) {
              this.presentToast("Date Naissance : " + this.errorpath.account.date_naissance[0])
            }
            
            if (this.errorpath.account.hasOwnProperty('username')) {
              this.presentToast("Pseudonyme : " + this.errorpath.account.username[0])
            }
            
            if (this.errorpath.account.hasOwnProperty('phone')) {
              this.presentToast("Numéro de téléphone : " + this.errorpath.account.phone[0])
            }
          }
          
        } else {
          this.internalerror = 1;
          this.presentToast((error.error).toString());
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
            
            this.takephotos();
            
          }
        },
        {
          text: 'Gallery',
          handler: () => {
            
            this.takegalerie();
            
            
          }
        }
      ]
    });
    alert.present();
  }
  
  
  takephotos() {
    console.log(this.platform);
    
    if (this.platform.is('mobileweb')) {
      this.getPicture().then(img => {
        this.imageaafficher = img;
      })
      
      return;
    }
    
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: 1,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 1
    }
    
    this.camera.getPicture(options).then((ImageData) => {
      let base64Image = ImageData;
      this.imageaafficher = "data:image/jpeg;base64," + ImageData;
      
      this.mylocalstorage.getSession().then((result: any) => {
        result.user._embedded.photo = this.imageaafficher;
        this.images.image = this.imageaafficher;
        this.mylocalstorage.storeSession(result).then(() => {
        });
      })
      
    }, (err) => {
      alert(err);
    })
    
    
  }
  
  
  takegalerie() {
    if (this.platform.is('mobileweb')) {
      this.getPicture().then(img => {
        this.imageaafficher = img;
      })
      
      return;
    }
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: 0,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 0
      
    }
    
    this.camera.getPicture(options).then((ImageData) => {
      let base64Image = ImageData;
      this.imageaafficher = "data:image/jpeg;base64," + ImageData;
      this.mylocalstorage.getSession().then((result: any) => {
        result.user._embedded.photo = this.imageaafficher;
        this.images.image = this.imageaafficher;
        this.mylocalstorage.storeSession(result).then(() => {
        });
      })
      
      this.imageaafficher = "data:image/jpeg;base64," + ImageData;
      
    }, (err) => {
      alert(err);
    })
  }
  
  getPicture() {
    return new Promise<string>((resolve) => {
      console.log('CameraMock');
      resolve("data:image/jpeg;base64,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");
    })
  }
  
}
