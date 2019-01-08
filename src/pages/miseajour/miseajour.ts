import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceProvider} from "../../providers/service";
import {LocalStorageProvider} from "../../providers/localstorage";
import * as deepEqual from "deep-equal";

/**
 * Generated class for the MiseajourPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-miseajour',
  templateUrl: 'miseajour.html',
})
export class MiseajourPage {
  private form: FormGroup = null;
  private object_to_save : MesMiseAJourObject
  isChange = false;
  vitalInfo = null;
  private  NUMBER_REGEXP = /^\s*(\-|\+)?(\d+|(\d*(\.\d*)))([eE][+-]?\d+)?\s*$/;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public services: ServiceProvider, public loadingCtrl: LoadingController,
              private formBuilder: FormBuilder, public localStorage: LocalStorageProvider,
              private alertCtrl: AlertController, private toastCtrl: ToastController) {
  }

  ionViewDidLoad() {
    this.services.initHeaders();
    console.log('ionViewDidLoad MiseajourPage');
    this.initForm();
  }

  initForm() {
    this.localStorage.getKey('vital_info').then(next => {
      this.isChange = next !== null;
      this.vitalInfo = next;
      this.form = this.formBuilder.group({
        poids: [next === null ? '' : next.poids, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        taille: [next === null ? '' : next.taille, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        taux_hemoglobine: [next === null ? '' : next.taux_hemoglobine, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        tension_arterielle_systolique: [next === null ? '' : next.tension_arterielle_systolique, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        tension_arterielle_diastolique: [next === null ? '' : next.tension_arterielle_diastolique, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        gyclemie_a_jeun: [next === null ? '' : next.gyclemie_a_jeun, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        temperature_vaginale: [next === null ? '' : next.temperature_vaginale, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        conclusion_last_c_p_n: [next === null ? '' : next.conclusion_last_c_p_n]
      })
    });
  }

  dateDebutTraitementChanged(event) {
    this.form.patchValue({updated_date: event.day + '/' + event.month + '/' + event.year})
  }
  
  changeListener($event) {
    if(!this.isChange) {
      this.isChange = true;
    }
  }

  submit() {
    if(this.form.valid) {
      if (!this.isChange) {
        this.presentToast("Veuillez renseigner au moins une valeur du formulaire!")
        return;
      }
      
      let toCompare = {
        ...this.form.value,
        updated_date: 0,
        id: 0
      }
  
      this.vitalInfo = {
        ...this.vitalInfo,
        updated_date: 0,
        id: 0
      }
  
      if (deepEqual(toCompare,this.vitalInfo)) {
        this.presentToast("Veuillez renseigner au moins une valeur du formulaire!")
        return;
      }
      
      console.log(this.form.value);

      let vitalInfo = null;

      let loading = this.loadingCtrl.create()
      loading.present()
      this.services.vitalInfo(this.form.value).subscribe(next => {
        console.log(next);
        vitalInfo = next._embedded.vital_info;
      }, error => {
        console.error(error.error)
        loading.dismiss()
      }, () => {
        loading.dismiss()
        loading.onDidDismiss(() => {
          let toast = this.toastCtrl.create({
            message: 'Mises à jour effectuées',
            duration: 3000,
            position: 'bottom'
          });
          toast.present();
          
          this.localStorage.setKey('vital_info', vitalInfo).then(onful => {
            this.initForm();
          })
        })
      });
    } else {
      console.log(this.form);
    }
  }

  cancel() {
    this.initForm();
  }
  
  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }
}

export interface MesMiseAJourObject {
  poids?: number;
  taille?: number;
  taux_hemoglobine?: number;
  tension_arterielle?: number;
  gyclemie_a_jeun: number;
  temperature_vaginale?: number;
  conclusion_last_c_p_n?: string;
}
