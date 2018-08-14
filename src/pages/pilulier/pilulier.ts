import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceProvider} from "../../providers/service";
import {LocalNotifications} from "@ionic-native/local-notifications";

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

  private currentTreatment = null;
  private datePickerModel = null;
  private timePickerModel = null;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public services: ServiceProvider, public loadingCtrl: LoadingController, private alertCtrl: AlertController,
              private localNotifications: LocalNotifications,) {
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
      name: [this.currentTreatment == null ? '' : this.currentTreatment.name, Validators.required],
      frequencePrise: [this.currentTreatment == null ? '' : this.currentTreatment.frequence_prise, Validators.required],
      dureeTraitement: [this.currentTreatment == null ? '' : this.currentTreatment.duree_traitement, Validators.required],
      dateDebutTraitement: ['', Validators.required],
      horaireFirstPrise: ['', Validators.required],
      jourCycle: [this.currentTreatment == null ? '' : this.currentTreatment.jour_cycle, Validators.required],
      evaluationEvolution: [this.currentTreatment == null ? '' : this.currentTreatment.evaluation_evolution, Validators.required],
    })

    if (this.currentTreatment !== null) {
      console.log(this.currentTreatment);
      let date: Date = new Date(this.currentTreatment.date_debut_traitement);
      this.datePickerModel = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      }
      this.dateDebutTraitementChanged(this.datePickerModel)

      let horaire: Date = new Date(this.currentTreatment.horaire_first_prise);
      this.timePickerModel = {
        hour: horaire.getHours(),
        minute: horaire.getMinutes()
      }
      this.heureDebutTraitementChanged(this.timePickerModel)


      // const item = this.currentTreatment;
      // let initDate = new Date(item.date_debut_traitement)
      // console.log(initDate);
      //
      // let initHoraire: Date = new Date(item.horaire_first_prise);
      // initDate.setHours(initHoraire.getHours(), initHoraire.getMinutes())
      // console.log(initDate);
      //
      // const dureeTreatment = item.duree_traitement * 24 // 1jr = 24h
      // console.log(dureeTreatment);
      // const frequencePrise = item.frequence_prise === 0 ? 6 : (item.frequence_prise === 1 ? 8 : 10)
      // console.log(frequencePrise);
      // let nombrePrise: number = (dureeTreatment / frequencePrise) - 1;
      // console.log(nombrePrise);
      //
      // while(nombrePrise >= 1) {
      //   initDate.setHours(initDate.getHours() + frequencePrise)
      //   console.log(initDate);
      //   nombrePrise--;
      // }
    }
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
    this.currentTreatment = null;
    this.getTreatments();
  }

  cancel() {
    this.currentTreatment = null;
    this.initForm();
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
      if (this.currentTreatment == null) {
        this.services.addTreatment(object).subscribe((next: any) => {
          console.log(next)
        }, error => {
          console.error(error)
          loading.dismiss()
        }, () => {
          loading.dismiss();
          loading.onDidDismiss(() => {
            this.cancel();
            this.initScheduleTreatement();
          })
        });
      } else {
        this.services.updateTreatment(this.currentTreatment.id, object).subscribe((next: any) => {
          console.log(next)
        }, error => {
          console.error(error)
          loading.dismiss()
        }, () => {
          loading.dismiss();
          loading.onDidDismiss(() => {
            this.cancel();
            this.initScheduleTreatement();
          })
        });
      }
    }
  }

  getTreatments() {
    return new Promise(resolve => {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.allTreatments().subscribe((next: any) => {
        this.treatments = next;
        console.log(next)
      }, error => {
        console.error(error)
        loading.dismiss()
      }, () => {
        loading.dismiss();
        loading.onDidDismiss(() => {
          resolve(this.treatments);
        })
      });
    })
  }

  gotoUpdate(item) {
    this.currentTreatment = item
    this.changetesteur1();
    this.initForm();
  }

  gotoDelete(item) {
    // const date = new Date("1970-01-01T10:48:00-05:00");
    // console.log(date.getUTCHours())
    // console.log(date.getMinutes())
    let alert = this.alertCtrl.create({
      title: 'Confirm purchase',
      message: 'Do you want to delete this treatement?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Okay',
          handler: () => {
            let loading = this.loadingCtrl.create();
            loading.present();
            this.services.deleteTreatment(item.id).subscribe((next: any) => {
              console.log(next)
            }, error => {
              console.error(error)
              loading.dismiss()
            }, () => {
              loading.dismiss();
              loading.onDidDismiss(() => {
                this.getTreatments();
              })
            });
          }
        }
      ]
    });
    alert.present();
  }

  initScheduleTreatement() {
    this.getTreatments().then(next => {
      if (this.treatments.length === 0)
        return;

      let notifications = []
      this.treatments.forEach((item: any) => {
        let initDate = new Date(item.date_debut_traitement)

        let initHoraire: Date = new Date(item.horaire_first_prise);
        initDate.setHours(initHoraire.getHours(), initHoraire.getMinutes())

        const dureeTreatment = item.duree_traitement * 24 // 1jr = 24h => duree_traitement * 24
        const frequencePrise = item.frequence_prise === 0 ? 6 : (item.frequence_prise === 1 ? 8 : 10) //En Heure
        let nombrePrise: number = (dureeTreatment / frequencePrise) - 1;

        while(nombrePrise >= 1) {
          initDate.setHours(initDate.getHours() + frequencePrise)
          console.log(initDate);
          notifications.push({
            id: 'Treatement-' + initDate.getTime(),
            text: 'Prise du médicament : ' + item.name,
            trigger: {
              at: new Date(new Date(initDate).getTime())
            },
            led: 'FF0000',
            sound: 'file://assets/imgs/notification.mp3'
          });
          nombrePrise--;
        }
      })

      this.localNotifications.schedule(notifications);
    }, error => {
      let alert = this.alertCtrl.create({
        title: error,
        buttons: ['Dismiss']
      });
      alert.present();
    })
  }
}
