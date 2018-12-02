import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  PopoverController
} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceProvider} from "../../providers/service";
import {
  ELocalNotificationTriggerUnit,
  ILocalNotification,
  ILocalNotificationAction,
  ILocalNotificationActionType,
  LocalNotifications
} from "@ionic-native/local-notifications";
import Schedule from "../../models/Schedule";
import * as functions from "../../variables/functions";
import * as v from "../../variables/variables_";
import {LocalStorageProvider} from "../../providers/localstorage";

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
  private onglet: any;
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
  
  private actions: Array<ILocalNotificationAction> = [
    {
      id: 'TAKE',
      title: 'Take',
      type: ILocalNotificationActionType.BUTTON,
      icon: 'checkmark-circle-outline'
    },
  ];
  private showSpinner: boolean = false;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public services: ServiceProvider, public loadingCtrl: LoadingController, private alertCtrl: AlertController,
              private localNotifications: LocalNotifications, private localStorageProvider: LocalStorageProvider,
              public popoverCtrl: PopoverController) {
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
    this.showSpinner = false;
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
        this.showSpinner = true;
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
          this.showSpinner = false;
        }, error => {
          console.error(error)
          this.showSpinner = false;
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
    if (this.treatments.find(x => x.name === item.name) === undefined) {
      this.medicament_search = item.name;
      this.nextPart()
    } else {
      let alert = this.alertCtrl.create({
        subTitle: 'Médicament existant !',
        message: 'Présence de ce médicament dans la liste des Traitements',
        buttons: ['Okay']
      });
      alert.present();
    }
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
    this.gotoOnglet_2();
    this.part = 1;
  }
  
  
  getFrequencePrise(id_frequence) {
    const id = this.frequencesPrise.findIndex(item => item.key === id_frequence);
    return (id != -1) ? (this.frequencesPrise[id]).value : 'NULL';
  }
  
  convertDatetime(time) {
    console.log(time);
    return functions.convertDatetimeToDate(time);
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
  
  gotoOnglet_1() {
    this.onglet = 0;
    this.part = 1;
    this.currentTreatment = null;
    this.initForm();
  }
  
  gotoOnglet_2() {
    this.onglet = 1;
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
            this.presentDialogAlert('Médicament crée avec succès!', () => this.gotoOnglet_2());
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
              this.presentDialogAlert('Médicament mis à jour avec succès!', () => this.gotoOnglet_2());
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
  
  presentPopover(item) {
    let popover = this.popoverCtrl.create('PopoverTreatementOptionsPage');
    popover.present();
    popover.onDidDismiss(data => {
      if (data === 1) {
        this.gotoUpdate(item)
      } else if (data === 2) {
        this.gotoDelete(item)
      }
    });
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
    this.onglet = 0;
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
    this.schedules.forEach(item => {
      const initDate = new Date(((item.date_alert).substring(0, 16)) + 'Z').getTime();
      const notif: ILocalNotification = {
        id: item.id,
        title: 'Prise de médicament',
        text: item.message,
        trigger: {
          at: new Date(initDate),
          unit: ELocalNotificationTriggerUnit.MINUTE,
          count: 5
        },
        led: 'FF0000',
        sound: 'file://assets/imgs/notification.mp3',
        vibrate: true,
        actions: [{
          id: `TAKE${item.id}`,
          title: 'Take',
          type: ILocalNotificationActionType.BUTTON,
          icon: 'checkmark-circle-outline'
        }],
      };
      this.localNotifications.schedule(notif);
      this.localNotifications.on(`TAKE${item.id}`).subscribe(next => {
        this.makeTakingTreatment(next.id).then(on => {
          this.presentDialogAlert('Taked');
        })
      }, error => {
        console.error(error);
      })
    });
  }
  
  deleteSchedules(ids: Array<number>) {
    ids.forEach(id => this.localNotifications.clear(id));
  }
  
  presentDialogAlert(message, callback: () => void = null) {
    let alert = this.alertCtrl.create({
      title: message,
      buttons: [{
        text: 'Okay',
        handler: () => {
          if (callback !== null) {
            callback();
          }
        }
      }]
    
    });
    alert.present();
  }
  
  makeTakingTreatment(id_alert) {
    return new Promise(resolve => {
      // if (this.services.statusNetwork) {
      //
      // } else {
      //
      // }
      this.localStorageProvider.getKey(v.LOCAL_STRG_TAKED_TREATEMENT).then((res: any) => {
        this.presentDialogAlert(JSON.stringify(res));
        if (res !== undefined && res !== null) {
          res.push(id_alert);
        } else {
          res = [];
          res.push(id_alert);
        }
        this.localStorageProvider.setKey(v.LOCAL_STRG_TAKED_TREATEMENT, res).then(on => {
          resolve(true);
        });
      });
    })
  }
}
