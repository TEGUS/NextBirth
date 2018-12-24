import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceProvider} from "../../providers/service";
import {LocalStorageProvider} from "../../providers/localstorage";

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
      this.form = this.formBuilder.group({
        poids: [next === null ? '' : next.poids, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        taille: [next === null ? '' : next.taille, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        taux_hemoglobine: [next === null ? '' : next.taux_hemoglobine, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        tension_arterielle: [next === null ? '' : next.tension_arterielle, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        gyclemie_a_jeun: [next === null ? '' : next.gyclemie_a_jeun, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        temperature_vaginale: [next === null ? '' : next.temperature_vaginale, Validators.compose([Validators.pattern(this.NUMBER_REGEXP)])],
        conclusion_last_c_p_n: [next === null ? '' : next.conclusion_last_c_p_n]
      })
    });
  }

  dateDebutTraitementChanged(event) {
    this.form.patchValue({updated_date: event.day + '/' + event.month + '/' + event.year})
  }

  submit() {
    if(this.form.valid) {
      this.object_to_save = {
        ...this.form.value
      }
      console.log(this.object_to_save);

      let vitalInfo = null;

      let loading = this.loadingCtrl.create()
      loading.present()
      this.services.vitalInfo(this.object_to_save).subscribe(next => {
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
