import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, ToastController} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceProvider} from "../../../providers/metier.service";
import {getCurrentDateWith} from "../../../variables/functions";

/**
 * Generated class for the BuildEventPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-build-event',
  templateUrl: 'build-event.html',
})
export class BuildEventPage {
  private form: FormGroup = null;
  dateStart: any = null;
  dateEnd: any = null;
  debut_dernieres_menstrues: any = null;
  event: any = null;
  
  constructor(public navCtrl: NavController, public navParams: NavParams,
              private formBuilder: FormBuilder, public loadingCtrl: LoadingController,
              private toastCtrl: ToastController, public services: ServiceProvider) {
    if (this.navParams.data.hasOwnProperty('event')) {
      this.event = this.navParams.data.event;
    }
  }
  
  ionViewWillEnter() {
    console.clear();
  }
  
  ionViewDidLoad() {
    if (this.event === null || this.event === undefined) {
      this.form = this.formBuilder.group({
        name: ['', Validators.compose([Validators.required])],
        description: ['', Validators.compose([Validators.required])],
        delaiJoursDebut: ['', Validators.compose([Validators.required])],
        delaiJoursFin: ['', Validators.compose([Validators.required])],
      })
      
      this.services.getDateDernierMenstrues().then(ddm => {
        this.debut_dernieres_menstrues = ddm;
      }, err => console.error(err));
    } else {
      this.form = this.formBuilder.group({
        name: [this.event.name, Validators.compose([Validators.required])],
        description: [this.event.description, Validators.compose([Validators.required])],
        delaiJoursDebut: [this.event.delai_jours_debut, Validators.compose([Validators.required])],
        delaiJoursFin: [this.event.delai_jours_fin, Validators.compose([Validators.required])],
      })
      
      this.services.getDateDernierMenstrues().then(ddm => {
        this.debut_dernieres_menstrues = ddm;
        
        this.dateStart = (getCurrentDateWith(this.debut_dernieres_menstrues, this.event.delai_jours_debut)).toISOString();
        this.dateEnd = (getCurrentDateWith(this.debut_dernieres_menstrues, this.event.delai_jours_fin)).toISOString();
      }, err => console.error(err));
    }
    
  }
  
  listenChangeDate(event, type) {
    let date = new Date();
    date.setMonth(event.month);
    date.setFullYear(event.year);
    date.setDate(event.day);
    
    let diff = date.getTime() - this.debut_dernieres_menstrues.getTime();
    let nbJr = Math.ceil(((((diff / 1000) / 60) / 60) / 24));
    
    console.log(nbJr);
    
    if (type === 'start') {
      this.form.patchValue({'delaiJoursDebut': nbJr})
      if (nbJr < 0) {
        this.presentToast("Mauvaise date debut !")
        this.form.patchValue({'delaiJoursDebut': ''})
        this.dateStart = '';
      }
    }
    
    if (type === 'end') {
      this.form.patchValue({'delaiJoursFin': nbJr})
      if (nbJr < 0) {
        this.presentToast("Mauvaise date fin !")
        this.form.patchValue({'delaiJoursFin': ''})
        this.dateEnd = '';
      }
    }
  }
  
  submit() {
    if (this.form.valid) {
      let loading = this.loadingCtrl.create()
      loading.present()
      
      if (this.event === null) {
        this.services.addEvent(this.form.value).subscribe(next => {
          loading.dismiss()
          this.navCtrl.pop()
        }, error => {
          loading.dismiss()
          console.error(error)
        })
      } else {
        this.services.updateEvent(this.form.value, this.event.id).subscribe(next => {
          loading.dismiss()
          this.navCtrl.pop()
        }, error => {
          loading.dismiss()
          console.error(error)
        })
      }
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
