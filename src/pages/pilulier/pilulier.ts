import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceProvider} from "../../providers/service";

/**
 * Generated class for the PilulierPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pilulier',
  templateUrl: 'pilulier.html',
})
export class PilulierPage {
  private testeur: any;
  private form: FormGroup;
  private treatments = [];
  private frequencesPrise = [];

  private dateDebutTraitement = null
  private heureDebutTraitement = null

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public services: ServiceProvider, public loadingCtrl: LoadingController) {
  }

  ionViewWillLoad() {
    this.initForm();

    this.services.getFrequencesPrise().subscribe((next: any) => {
      this.frequencesPrise = next
    }, error => {
      console.error(error);
    }, () => {
    });
  }

  initForm() {
    this.dateDebutTraitement = null;
    this.heureDebutTraitement = null;
    this.form = this.formBuilder.group({
      name: ['', Validators.required],
      frequencePrise: ['', Validators.required],
      dureeTraitement: ['', Validators.required],
      dateDebutTraitement: ['', Validators.required],
      horaireFirstPrise: ['', Validators.required],
      jourCycle: ['', Validators.required],
      evaluationEvolution: ['', Validators.required],
    })
  }

  ionViewDidLoad() {
    this.testeur = 0;
    console.log('ionViewDidLoad PilulierPage !');
  }

  dateDebutTraitementChanged(event) {
    console.log(event);
    this.dateDebutTraitement = event;
    this.form.patchValue({dateDebutTraitement: event.day + '/' + event.month + '/' + event.year})
  }

  heureDebutTraitementChanged(event) {
    console.log(event);
    this.heureDebutTraitement = event;
    this.form.patchValue({horaireFirstPrise: event.hour + ':' + event.minute})
  }

  changetesteur1() {
    this.testeur = 0;
  }

  changetesteur2() {
    this.testeur = 1;
  }

  addTreatment() {
    if (this.form.valid) {
      const object = {
        name: this.form.value.name,
        frequencePrise: Number(this.form.value.frequencePrise),
        dureeTraitement: Number(this.form.value.dureeTraitement),
        dateDebutTraitement: this.dateDebutTraitement,
        horaireFirstPrise: this.heureDebutTraitement,
        jourCycle: Number(this.form.value.jourCycle),
        evaluationEvolution: this.form.value.evaluationEvolution
      }

      console.log(object);
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.addTreatment(object).subscribe((next: any) => {
        console.log(next)
      }, error => {
        console.error(error)
        loading.dismiss()
      }, () => {
        loading.dismiss();
        loading.onDidDismiss(() => {
          this.initForm();
        })
      });
    }
  }
}
