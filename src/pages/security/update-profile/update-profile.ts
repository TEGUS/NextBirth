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
import {formatDate, formatNumberOfDate, handleError} from "../../../variables/functions";
import {imagesB64} from "../../../configs/configs";
import {getRandomInt} from "../../../helpers/functions";

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

  public object: ObjectUpdateProfile = null;
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

  errorObject = null;
  patient = null;
  user = null;
  date_naissance = null;
  debut_dernieres_menstrues = null;
  date_vaccin_anti_tetanique = null;

  maxYear = null;
  minYear = null;

  errorUpdateProfile: ErrorUpdateProfile = {};

  constructor(public navCtrl: NavController, public mylocalstorage: LocalStorageProvider, private base64: Base64,
              private camera: Camera, public services: ServiceProvider, public loadingCtrl: LoadingController,
              public toastCtrl: ToastController, public navParams: NavParams, public localStorage: LocalStorageProvider,
              public alertCtrl: AlertController, public platform: Platform) {
  }

  ionViewDidLoad() {
    this.services.initHeaders();
  }

  ionViewWillEnter() {
    this.maxYear = (new Date()).getFullYear() - 12;
    this.minYear = (new Date()).getFullYear() - 60;

    this.object = {
      diabete: 0,
      hta: 0,
      drepano: 0,
      agePremiereRegle: null,
      dureeSaignement: null,
      dureeMenstrues: null,
      dureeCycleMax: null,
      dureeCycleMin: null,
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
      this.modeSelectedExist = mode !== null;
    });

    this.localStorage.getKey('session').then(next => {
      console.log(next);
      if (next !== undefined && next !== null) {
        this.patient = next.user._embedded.patient;

        this.object.diabete = this.patient.diabete;
        this.object.hta = this.patient.hta;
        this.object.drepano = this.patient.drepano;

        if (this.patient._embedded.hasOwnProperty('account')) {
          this.user = this.patient._embedded.account;
        } else {
          this.user = next.user
        }

        this.castUsername(this.user).then(user => {
          console.log(user);
          this.user = user;

          this.date_naissance = formatDate(this.user.date_naissance);
          this.debut_dernieres_menstrues = formatDate(this.patient.debut_dernieres_menstrues)
          this.date_vaccin_anti_tetanique = formatDate(this.patient.date_vaccin_anti_tetanique)

          console.log(this.date_naissance)
          console.log(this.debut_dernieres_menstrues)

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
      let res = (user.username).indexOf("@nextbirth.com");
      user.username = res === -1 ? user.username : null;
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
    this.object.dureeMenstrues = dureeSaignement;
  }

  getDureeCycleMin(dureeCycle) {
    this.object.dureeCycleMin = dureeCycle;
    console.log(dureeCycle)
  }

  getDureeCycleMax(dureeCycle) {
    this.object.dureeCycleMax = dureeCycle;
    console.log(dureeCycle)
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
        // this.object.agePremiereRegle === null ||
      // this.object.dureeSaignement === null ||
      // this.object.dureeCycleMin === null ||
      // this.object.dureeCycleMax === null ||
      // this.object.nombreGrossesse === null || this.object.nombrePremature === null ||
      // this.object.nombreFosseCouche === null || this.object.nombreEnfantVivant === null ||
        this.username === '' || this.username === null
      // || this.phone === '' || this.phone === null
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

    // if (this.phone === this.username) {
    //   result.msg = "Le numéro de téléphone doit être différent du pseudonyme !";
    //   result.error = true;
    // }
    // if (this.phone === this.user.email) {
    //   result.msg = "Le numéro de téléphone doit être différent de l'adresse email !";
    //   result.error = true;
    // }

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
        // phone: this.phone,
        dateNaissance: this.ladate
      };

      if (this.object.dureeCycleMin > this.object.dureeCycleMax) {
        this.presentToast('La durée minimal doit être inférieur ou égale à la durée maximale du cycle.');
        return;
      }

      console.log(this.object);

      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.updateprofile(this.object).subscribe(next => {
        console.log("UPDATE_PROFILE")
        console.log(next)
        this.localStorage.updatePatientStorage(next);

        if (this.images.image != "") {
          this.services.editImage(this.images).subscribe(next => {
          }, error => {
          }, () => {
          })
        }
      }, error => {
        if (handleError(error) === 0) {
          this.navCtrl.setRoot('ErrorPage');
        }

        console.error(error.error.errors);
        loading.dismiss();

        if (undefined != error.error.errors) {
          this.errorpath = error.error.errors;
          this.errorObject = error.error.errors;

          this.buildError();

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
      // this.presentToast('Veuillez remplir tous les champs');
      this.presentToast('Veuillez renseigner votre pseudonyme');
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
            });
            break;
          case codesMode.CONTPR:
            this.navCtrl.setRoot("ModeContraceptionPage", {
              title: mode.intitule
            });
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

    if (this.platform.is('core')) {
      this.getPicture().then(img => {
        this.imageaafficher = img;

        this.mylocalstorage.getSession().then((result: any) => {
          result.user._embedded.photo = this.imageaafficher;
          this.images.image = this.imageaafficher;
          this.mylocalstorage.storeSession(result).then(() => {
          });
        });
      });
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
      });
    }, (err) => {
      alert(err);
    });
  }


  takegalerie() {
    if (this.platform.is('core')) {
      this.getPicture().then(img => {
        this.imageaafficher = img;

        this.mylocalstorage.getSession().then((result: any) => {
          result.user._embedded.photo = this.imageaafficher;
          this.images.image = this.imageaafficher;
          this.mylocalstorage.storeSession(result).then(() => {
          });
        });
      });
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
      });

      this.imageaafficher = "data:image/jpeg;base64," + ImageData;

    }, (err) => {
      alert(err);
    })
  }

  getPicture() {
    return new Promise<string>((resolve) => {
      console.log('CameraMock');
      const imgs: Array<any> = imagesB64;
      resolve(imagesB64[getRandomInt(imgs.length)]);
    })
  }

  buildError() {
    this.errorUpdateProfile = {};

    if (this.errorObject.hasOwnProperty('account')) {
      if (this.errorObject.account.hasOwnProperty('dateNaissance')) {
        this.errorUpdateProfile.dateNaissance = this.errorObject.account.dateNaissance[0];
      }

      if (this.errorObject.account.hasOwnProperty('username')) {
        this.errorUpdateProfile.username = this.errorObject.account.username[0];
      }
    }

    if (this.errorObject.hasOwnProperty('debutDernieresMenstrues')) {
      this.errorUpdateProfile.debutDernieresMenstrues = this.errorObject.debutDernieresMenstrues[0];
    }

    console.log(this.errorUpdateProfile);
  }

}

interface ErrorUpdateProfile {
  diabete?: any,
  hta?: any,
  drepano?: any,
  agePremiereRegle?: any,
  dureeSaignement?: any,
  dureeMenstrues?: any,
  dureeCycleMax?: any,
  dureeCycleMin?: any,
  cycleRegulier?: any,
  douleurRegle?: any,
  nombreGrossesse?: any,
  nombrePremature?: any,
  nombreFosseCouche?: any,
  nombreEnfantVivant?: any,
  dateVaccinAntiTetanique?: any,
  debutDernieresMenstrues?: any,
  username?: null,
  dateNaissance?: null
}

interface ObjectUpdateProfile {
  diabete: any,
  hta: any,
  drepano: any,
  agePremiereRegle: any,
  dureeSaignement: any,
  dureeMenstrues: any,
  dureeCycleMax: any,
  dureeCycleMin: any,
  cycleRegulier: any,
  douleurRegle: any,
  nombreGrossesse: any,
  nombrePremature: any,
  nombreFosseCouche: any,
  nombreEnfantVivant: any,
  dateVaccinAntiTetanique: any,
  debutDernieresMenstrues: any,
  account?: {
    username: null,
    dateNaissance: null
  }
}
