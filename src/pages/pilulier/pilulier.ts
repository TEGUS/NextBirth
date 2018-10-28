import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceProvider} from "../../providers/service";
import {LocalNotifications} from "@ionic-native/local-notifications";
import Schedule from "../../models/Schedule";
import * as functions from "../../variables/functions";

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
  private part: any;
  private form: FormGroup;
  private treatments = [];
  private frequencesPrise = [];
  
  private medicament_search = null;
  private listMedicaments = [];
  
  private dateDebutTraitement = new Date().toISOString();
  private heureDebutTraitement = new Date().toISOString();
  
  private currentTreatment = null;
  private madate = null;
  private monheure = null;
  
  private schedules: Schedule[];
  private subscription = null;
  private showResultMedicaent = false;
  
  private actions = [
    {
      identifier: 'TAKE',
      title: 'Take',
      activationMode: 'background',
      destructive: false,
    },
  ];
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public services: ServiceProvider, public loadingCtrl: LoadingController, private alertCtrl: AlertController,
              private localNotifications: LocalNotifications) {
  }
  
  ionViewWillLoad() {
    this.initForm();
    
    this.services.initHeaders().then(r => {
      let val = [];
      this.services.getFrequencesPrise().subscribe((next: any) => {
        console.log(next);
        this.frequencesPrise = next.frequences_prise
        console.log(this.frequencesPrise);
      }, error => {
        console.error(error);
      });
    });
  }
  
  //region Searchbar Medicament Name
  
  cancelSearchbar(ev: any) {
    if (this.subscription !== undefined && this.subscription !== null) {
      this.subscription.unsubscribe()
      this.medicament_search = ''
      this.listMedicaments = []
    }
  }
  
  getMedicaments(ev: any) {
    // set val to the value of the searchbar
    if (ev.target.value !== undefined) {
      this.cancelSearchbar(null);
      
      const val = (ev.target.value).trim();
      
      // if the value is an empty string don't filter the items
      if (val && val.trim() != '') {
        this.subscription = this.services.getMedicamentByName(val).subscribe(next => {
          console.log(next);
          if (next.medicaments.length === 0) {
            this.listMedicaments[0] = {
              name: val
            };
          } else {
            this.listMedicaments = next.medicaments
          }
          
          this.showResultMedicaent = true
        }, error => {
          console.error(error)
        })
      }
    }
  }
  
  nextPart() {
    if (this.listMedicaments.length !== 0) {
      if (this.medicament_search !== undefined && this.medicament_search !== null && this.medicament_search.trim() !== '') {
        this.part = 2;
        this.form.patchValue({'name': this.medicament_search})
      }
    }
  }
  
  selectMedicament(item) {
    this.medicament_search = item.name
    this.nextPart()
  }
  
  //endregion
  
  initForm() {
    this.dateDebutTraitement = new Date().toISOString();
    this.heureDebutTraitement = new Date().toISOString();
    
    this.form = this.formBuilder.group({
      name: [this.currentTreatment == null ? '' : this.currentTreatment.name, Validators.required],
      frequencePrise: [this.currentTreatment == null ? '' : this.currentTreatment.frequence_prise, Validators.required],
      dureeTraitement: [this.currentTreatment == null ? '' : this.currentTreatment.duree_traitement, Validators.required],
      dateDebutTraitement: ['', Validators.required],
      horaireFirstPrise: ['', Validators.required],
      // jourCycle: [this.currentTreatment == null ? '' : this.currentTreatment.jour_cycle, Validators.required],
      // evaluationEvolution: [this.currentTreatment == null ? '' : this.currentTreatment.evaluation_evolution, Validators.required],
    });
    
    if (this.currentTreatment !== null) {
      console.log(this.currentTreatment);
      // let date: Date = new Date(this.currentTreatment.date_debut_traitement);
      let date = new Date((this.currentTreatment.date_debut_traitement).split('T')[0]);
      console.log(date);
      const datePickerModel = {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate()
      };
      this.dateDebutTraitementChanged(datePickerModel);
      let date_ = new Date();
      date_.setFullYear(datePickerModel.year, datePickerModel.month - 1, datePickerModel.day);
      this.dateDebutTraitement = new Date(date_).toISOString();
      console.log(this.dateDebutTraitement);
      
      // let horaire: Date = new Date(this.currentTreatment.horaire_first_prise);
      let horaire: Array<any> = (this.currentTreatment.horaire_first_prise).split(':');
      const timePickerModel = {
        hour: Number(horaire[0]),
        minute: Number(horaire[1])
      };
      this.heureDebutTraitementChanged(timePickerModel);
      let heure = new Date();
      heure.setHours(timePickerModel.hour, timePickerModel.minute);
      this.heureDebutTraitement = new Date(heure).toLocaleTimeString();
      console.log(this.heureDebutTraitement);
    }
  }
  
  ionViewDidLoad() {
    this.testeur = 0;
    this.part = 1;
  }
  
  
  getFrequencePrise(id_frequence) {
    const id = this.frequencesPrise.findIndex(item => item.key === id_frequence);
    return (id != -1) ? (this.frequencesPrise[id]).value : 'NULL';
  }
  
  convertDatetime(time) {
    console.log(time);
    return functions.convertDatetime(time);
  }
  
  dateDebutTraitementChanged(event) {
    console.log(event);
    // this.dateDebutTraitement = event;
    this.madate = event.year + '-' + event.month + '-' + event.day + 'T19:46:57.118Z';
    this.form.patchValue({dateDebutTraitement: event.day + '/' + event.month + '/' + event.year})
  }
  
  heureDebutTraitementChanged(event) {
    console.log(event);
    // this.heureDebutTraitement = event;
    if (event.minute > 10) {
      this.monheure = event.hour + ':' + event.minute + ':00';
    } else {
      this.monheure = event.hour + ':0' + event.minute + ':00';
    }
    
    this.form.patchValue({horaireFirstPrise: event.hour + ':' + event.minute})
  }
  
  changetesteur1() {
    this.testeur = 0;
    this.part = 1;
    this.currentTreatment = null;
    this.initForm();
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
        frequence_prise: Number(this.form.value.frequencePrise),
        duree_traitement: Number(this.form.value.dureeTraitement),
        date_debut_traitement: this.madate,
        horaire_first_prise: this.monheure,
        // jour_cycle: Number(this.form.value.jourCycle),
        // evaluation_evolution: this.form.value.evaluationEvolution
      };
      
      console.log(object);
      
      let loading = this.loadingCtrl.create();
      loading.present();
      if (this.currentTreatment == null) {
        this.services.addTreatment(object).subscribe((next: Schedule[]) => {
          console.log(next);
          this.schedules = next;
        }, error => {
          console.error(error);
          loading.dismiss();
        }, () => {
          loading.dismiss();
          loading.onDidDismiss(() => {
            this.cancel();
            this.presentDialogAlert('Médicament crée avec succès!');
            this.initScheduleTreatement();
          })
        });
      } else {
        this.getAlerts(this.currentTreatment.id).then((alerts: Array<any>) => {
          this.deleteSchedules(alerts);
          this.services.updateTreatment(this.currentTreatment.id, object).subscribe((next: Schedule[]) => {
            console.log(next);
            this.schedules = next;
          }, error => {
            console.error(error);
            loading.dismiss()
          }, () => {
            loading.dismiss();
            loading.onDidDismiss(() => {
              this.cancel();
              this.presentDialogAlert('Médicament mis à jour avec succès!');
              this.initScheduleTreatement();
            })
          });
        }, error => {
          console.error(error);
          loading.dismiss();
        });
      }
    }
  }
  
  getAlerts(id_treatment) {
    return new Promise((resolve, reject) => {
      this.services.getAlertsTreatment(id_treatment).subscribe(next => {
        console.log(next);
        resolve(next.alerts);
      }, error => {
        reject(error);
      })
    });
  }
  
  getTreatments() {
    return new Promise(resolve => {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.allTreatments().subscribe((next: any) => {
        this.treatments = next;
        console.log(next)
      }, error => {
        console.error(error);
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
    this.currentTreatment = item;
    this.testeur = 0;
    this.part = 2
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
              console.log(next);
              if (next !== null && next.alerts !== undefined) {
                this.deleteSchedules(next.alerts);
              }
            }, error => {
              console.error(error);
              loading.dismiss()
            }, () => {
              loading.dismiss();
              loading.onDidDismiss(() => {
                this.presentDialogAlert('Médicament supprimé avec succès');
                this.getTreatments();
              })
            });
          }
        }
      ]
    });
    alert.present();
  }
  
  take(item) {
    console.log(item);
  }
  
  initScheduleTreatement() {
    console.log(this.schedules);
    let notifications = [];
    this.schedules.forEach(item => {
      let initDate = new Date(item.date_alert);
      notifications.push({
        id: `Treatement ${item.id}`,
        text: item.message,
        trigger: {
          at: new Date(new Date(initDate).getTime())
        },
        led: 'FF0000',
        sound: 'file://assets/imgs/notification.mp3',
        actions: this.actions
      });
    });
    this.localNotifications.schedule(notifications);
    this.localNotifications.on('TAKE').subscribe(next => {
      console.log(next);
    }, error => {
      console.error(error);
    })
    
    // this.getTreatments().then(next => {
    //   if (this.treatments.length === 0)
    //     return;
    //
    //   let notifications = []
    //   this.treatments.forEach((item: any) => {
    //     let initDate = new Date(item.date_debut_traitement)
    //
    //     let initHoraire: Date = new Date(item.horaire_first_prise);
    //     initDate.setHours(initHoraire.getHours(), initHoraire.getMinutes())
    //
    //     const dureeTreatment = item.duree_traitement * 24 // 1jr = 24h => duree_traitement * 24
    //     const frequencePrise = item.frequence_prise === 0 ? 6 : (item.frequence_prise === 1 ? 8 : 10) //En Heure
    //     let nombrePrise: number = (dureeTreatment / frequencePrise) - 1;
    //
    //     while(nombrePrise >= 1) {
    //       initDate.setHours(initDate.getHours() + frequencePrise)
    //       notifications.push({
    //         id: 'Treatement-' + initDate.getTime(),
    //         text: 'Prise du médicament : ' + item.name,
    //         trigger: {
    //           at: new Date(new Date(initDate).getTime())
    //         },
    //         led: 'FF0000',
    //         sound: 'file://assets/imgs/notification.mp3'
    //       });
    //       nombrePrise--;
    //     }
    //   })
    //
    //   this.localNotifications.schedule(notifications);
    // }, error => {
    //   let alert = this.alertCtrl.create({
    //     title: error,
    //     buttons: ['Dismiss']
    //   });
    //   alert.present();
    // })
  }
  
  deleteSchedules(ids: Array<number>) {
    ids.forEach(id => {
      this.localNotifications.clear(`Treatement ${id}`);
    })
  }
  
  presentDialogAlert(message) {
    let alert = this.alertCtrl.create({
      title: message,
      buttons: ['Ok']
    });
    alert.present();
  }
}
