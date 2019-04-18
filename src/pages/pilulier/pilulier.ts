import {Component} from '@angular/core';
import {
  AlertController,
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  PopoverController, ToastController
} from 'ionic-angular';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ServiceProvider} from "../../providers/metier.service";
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
import {LocalStorageProvider} from "../../providers/localstorage.service";
import {showDateAndTime, getCurrentDateWith, getDate, handleError} from "../../variables/functions";
import {formatNumberOfDate} from "../../variables/functions";

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
  private archives = [];
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
  private isModeGrs: boolean = false;
  
  private debut_dernieres_menstrues: Date = null;
  
  showFooter = false;
  private startProcessGet: boolean = false;
  
  misesEnGarde = [];
  globalError = null;
  
  page = 1;
  private finishLoadTreatment: boolean = true;
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
              public services: ServiceProvider, public loadingCtrl: LoadingController, private alertCtrl: AlertController,
              private localNotifications: LocalNotifications, public popoverCtrl: PopoverController,
              private localStorage: LocalStorageProvider, private toastCtrl: ToastController) {
  }
  
  isShowFooter(bool = false) {
    this.showFooter = bool;
  }
  
  ionViewWillEnter() {
    this.localStorage.getKey('mode').then(mode => {
      this.isModeGrs = mode !== null && mode.code === "MO1";
      
      console.log(this.isModeGrs)
      
      if (this.isModeGrs) {
        this.localStorage.getKey('session').then(next => {
          let user = next.user;
          if (user !== null) {
            this.debut_dernieres_menstrues = getDate(user._embedded.patient.debut_dernieres_menstrues)
          }
        }, error => console.error(error));
      }
    });
    
    // Chargement des mises en garde
    this.services.getAllSituations().then((result: any) => {
      this.misesEnGarde = result;
    });
  }
  
  checkTrim(treatement): any {
    const today = new Date();
    let msg = null;
    
    let dateEndFirstTrimestre: Date = new Date(this.debut_dernieres_menstrues);
    dateEndFirstTrimestre.setDate(dateEndFirstTrimestre.getDate() + 105);
    
    let dateEndSecondTrimestre: Date = new Date(dateEndFirstTrimestre);
    dateEndSecondTrimestre.setDate(dateEndFirstTrimestre.getDate() + 90);
    
    let dateEndThirdTrimestre: Date = new Date(dateEndSecondTrimestre);
    dateEndSecondTrimestre.setDate(dateEndSecondTrimestre.getDate() + 93);
    
    console.clear()
    console.log(this.debut_dernieres_menstrues);
    console.log(dateEndFirstTrimestre);
    console.log(dateEndSecondTrimestre);
    console.log(dateEndThirdTrimestre);
    
    if (today <= dateEndFirstTrimestre) {
      msg = this.getCurrentStatusMessage(treatement.status_first_trimestre);
    } else if (today <= dateEndSecondTrimestre) {
      msg = this.getCurrentStatusMessage(treatement.status_second_trimestre);
    } else {
      msg = this.getCurrentStatusMessage(treatement.status_third_trimestre);
    }
    
    console.log(msg);
    
    return msg;
  }
  
  getCurrentStatusMessage(status): any {
    switch (status) {
      case 1:
        return null;
      case 2:
        return {
          status: 'warning',
          msg: "Attention ! L'usage de ce médicament serait déconseillé " +
            "durant ce trimestre de votre grossesse. \nRapprochez-vous " +
            "du prescipteur pour plus de précisions."
        }
      case 3:
        return {
          status: 'danger',
          msg: "Attention ! L'usage de ce médicament serait dangereux et interdit " +
            "durant ce trimestre de votre grossesse. \nRapprochez-vous du prescipteur " +
            "pour plus de précisions."
        };
    }
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
          
          console.log(this.listMedicaments);
          
          this.showResultMedicaent = true
          this.showSpinner = false;
        }, error => {
          console.error(error)
          this.showSpinner = false;
  
          if (handleError(error) === 0) {
            this.navCtrl.setRoot('ErrorPage');
          }
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
    let idOfTreatement = this.treatments.findIndex(x => x.name === item.name);
    let idOfListSearch = this.listMedicaments.findIndex(x => x.name === item.name);
    
    if (idOfTreatement === -1) {
      this.medicament_search = item.name;
      this.nextPart()
      this.isShowFooter(true);
    } else {
      let alert = this.alertCtrl.create({
        subTitle: 'Médicament existant !',
        message: 'Présence de ce médicament dans la liste des Traitements',
        buttons: [{
          text: 'Okay',
          handler: () => {
            this.listMedicaments.splice(idOfListSearch, 1);
            this.presentDialogAlert("Veuillez Changer de médicament !")
            this.medicament_search = ''
          }
        }]
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
    this.gotoOnglet_1();
    this.part = 1;
  }
  
  
  getFrequencePrise(id_frequence) {
    const id = this.frequencesPrise.findIndex(item => item.key === id_frequence);
    return (id != -1) ? (this.frequencesPrise[id]).value : 'NULL';
  }
  
  convertDatetime(time) {
    console.log(time);
    return functions.showDate(time);
  }
  
  dateDebutTraitementChanged(event) {
    console.log(event);
    // this.madate = event.year + '-' + event.month + '-' + event.day + 'T19:46:57.118Z';
    this.madate = `${formatNumberOfDate(event.day)}-${formatNumberOfDate(event.month)}-${event.year}`
    this.form.patchValue({dateDebutTraitement: event.day + '/' + event.month + '/' + event.year})
  }
  
  heureDebutTraitementChanged(event) {
    console.log(event);
    if (event.minute > 10) {
      this.monheure = event.hour + ':' + event.minute;
    } else {
      this.monheure = event.hour + ':0' + event.minute;
    }
    
    this.form.patchValue({horaireFirstPrise: event.hour + ':' + event.minute})
  }
  
  gotoOnglet_0() {
    this.part = 1;
    this.onglet = 0;
    this.currentTreatment = null;
    this.initForm();
    
    if (this.onglet === 0 && this.part === 2) {
      this.isShowFooter(true);
    }
  }
  
  gotoOnglet_1() {
    this.onglet = 1;
    this.currentTreatment = null;
    this.page = 1;
    this.getTreatments();
    this.isShowFooter()
  }
  
  gotoOnglet_2() {
    this.onglet = 2;
    this.isShowFooter()
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
        dateDebutTraitement: this.madate,
        horaireFirstPrise: this.monheure
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
  
          if (handleError(error) === 0) {
            this.navCtrl.setRoot('ErrorPage');
          }
        }, () => {
          loading.dismiss();
          loading.onDidDismiss(() => {
            this.cancel();
            this.gotoOnglet_1()
            this.presentDialogAlert('Médicament crée avec succès!');
            this.initScheduleTreatement();
            this.isShowFooter()
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
  
            if (handleError(error) === 0) {
              this.navCtrl.setRoot('ErrorPage');
            }
          }, () => {
            loading.dismiss();
            loading.onDidDismiss(() => {
              this.cancel();
              this.gotoOnglet_1()
              this.presentDialogAlert('Médicament mis à jour avec succès!');
              this.initScheduleTreatement();
              this.isShowFooter();
            })
          });
        }, error => {
          console.error(error);
          loading.dismiss();
        });
      }
    }
  }
  
  presentPopover(event, item) {
    let popover = this.popoverCtrl.create('PopoverTreatementOptionsPage');
    popover.present({
      ev: event
    });
    popover.onDidDismiss(data => {
      if (data === 1) {
        this.gotoUpdate(item)
        this.isShowFooter(true)
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
      
      this.startProcessGet = true;
      this.treatments = [];
      
      this.processGetTreatment().then((next: any) => {
        this.archives = next.archives;
        this.treatments = next.treatments;
        
  
        if (this.treatments.length === 0 || this.archives.length === 0) {
          this.globalError = 'Pas de traitement';
        }
  
        this.startProcessGet = false;
  
        loading.dismiss();
        loading.onDidDismiss(() => {
          resolve(this.treatments);
        });
      }, error => {
        console.error(error);
        loading.dismiss()
        this.startProcessGet = false;
  
        if (handleError(error) === 0) {
          this.navCtrl.setRoot('ErrorPage');
        }
      });
      
      // this.services.allTreatments(this.page).subscribe((next: any) => {
      //   console.log(next);
      //   let tmp = [];
      //   this.archives = [];
      //
      //   /**
      //    * Filtrer les traitements en cours des traitements terminés.
      //    */
      //   next.forEach(t => {
      //     const dateDebT = new Date((t.date_debut_traitement).split('T')[0]);
      //     const horaire: Array<any> = (t.horaire_first_prise).split(':');
      //     dateDebT.setHours(Number(horaire[0]), Number(horaire[1]));
      //     const dateTraitment = getCurrentDateWith(dateDebT, t.duree_traitement);
      //
      //     t._embedded.date_creation = showDateAndTime(t._embedded.date_creation);
      //
      //     if ((new Date()) > dateTraitment) {
      //       this.archives.push(t);
      //     } else {
      //       tmp.push(t);
      //     }
      //   });
      //
      //   next = tmp;
      //
      //   if (this.isModeGrs) {
      //     next.forEach(m => {
      //       if (m._embedded.core_medicament !== null) {
      //         m = {
      //           ...m,
      //           msg_alert: this.checkTrim(m._embedded.core_medicament)
      //         }
      //       }
      //       this.treatments.push(m);
      //     })
      //   } else {
      //     this.treatments = next;
      //   }
      //
      //   if (this.treatments.length === 0 || this.archives.length === 0) {
      //     this.globalError = 'Pas de traitement';
      //   }
      //
      //   // console.log(next)
      //   // console.log(this.archives)
      // }, error => {
      //   console.error(error);
      //   loading.dismiss()
      //   this.startProcessGet = false;
      //
      //   if (handleError(error) === 0) {
      //     this.navCtrl.setRoot('ErrorPage');
      //   }
      // }, () => {
      //   loading.dismiss();
      //   loading.onDidDismiss(() => {
      //     resolve(this.treatments);
      //   })
      //   this.startProcessGet = false;
      // });
    })
  }
  
  processGetTreatment() {
    let treatments = [];
    let archives = [];
    
    return new Promise((resolve, reject) => {
      this.services.allTreatments(this.page).subscribe((next: any) => {
        const tmp = [];
        console.log(next);
        
        next = next.items;
        
        if (next.length === 0) {
          this.finishLoadTreatment = false;
        }
        
        /**
         * Filtrer les traitements en cours des traitements terminés.
         */
        next.forEach(t => {
          const dateDebT = new Date((t.date_debut_traitement).split('T')[0]);
          const horaire: Array<any> = (t.horaire_first_prise).split(':');
          dateDebT.setHours(Number(horaire[0]), Number(horaire[1]));
          const dateTraitment = getCurrentDateWith(dateDebT, t.duree_traitement);
      
          t._embedded.date_creation = showDateAndTime(t._embedded.date_creation);
      
          if ((new Date()) > dateTraitment) {
            archives.push(t);
          } else {
            tmp.push(t);
          }
        });
    
        next = tmp;
    
        if (this.isModeGrs) {
          next.forEach(m => {
            if (m._embedded.core_medicament !== null) {
              m = {
                ...m,
                msg_alert: this.checkTrim(m._embedded.core_medicament)
              }
            }
            treatments.push(m);
          })
        } else {
          treatments = next;
        }
  
        resolve({
          treatments: treatments,
          archives: archives
        });
      }, error => {
        this.finishLoadTreatment = false;
        reject(error);
      });
    })
  }
  
  doInfiniteBottom(infiniteScroll) {
    setTimeout(() => {
      
      if (this.finishLoadTreatment) {
        this.page = this.page + 1;
  
        this.processGetTreatment().then((next: any) => {
          this.treatments = this.treatments.concat(next.treatments);
          this.archives = this.archives.concat(next.archives);
        }, error => {
          this.finishLoadTreatment = false;
          console.error(error);
        });
      }
      
      infiniteScroll.complete();
    }, 1000);
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
                this.page = 1;
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
    console.log(this.schedules)
    const title = 'Prise de médicament';
    this.schedules.forEach(item => {
      const initDate = new Date(((item.date_alert).substring(0, 16)) + 'Z').getTime();
      const notif: ILocalNotification = {
        id: item.id,
        title: title,
        text: item.message,
        trigger: {
          at: new Date(initDate),
          unit: ELocalNotificationTriggerUnit.MINUTE,
          count: 5
        },
        led: 'FF0000',
        sound: 'file://assets/imgs/notification.mp3',
        vibrate: true,
        actions: [
          // {
          //   id:`OPEN`,
          //   title: 'Ouvrir',
          //   type: ILocalNotificationActionType.BUTTON,
          //   icon: 'checkmark-circle-outline'
          // },
          {
            id: `TAKE`,
            title: 'Marquer la prise',
            type: ILocalNotificationActionType.BUTTON,
            icon: 'checkmark-circle-outline'
          }
        ],
      };
      this.localNotifications.schedule(notif);
      
      // this.localNotifications.on(`TAKE${item.id}`).subscribe(next => {
      //   this.storeMiseEnGarde(next);
      //
      //   this.makeTakingTreatment(next.id).then(on => {
      //     let loading = this.loadingCtrl.create();
      //     loading.present();
      //     this.services.takedMedicament(next.id).subscribe(r => {
      //       loading.dismiss();
      //       this.presentDialogAlert('Taked');
      //     });
      //   });
      // }, error => console.error(error));
      //
      // this.localNotifications.on(`OPEN${item.id}`).subscribe(next => {
      //   this.storeMiseEnGarde(next);
      // }, error => console.error(error));
      //
      // this.localNotifications.on(`click`).subscribe(next => {
      //   this.storeMiseEnGarde(next);
      //
      //   this.makeTakingTreatment(next.id).then(on => {
      //     let loading = this.loadingCtrl.create();
      //     loading.present();
      //     this.services.takedMedicament(next.id).subscribe(r => {
      //       loading.dismiss();
      //       this.presentDialogAlert('Taked');
      //     });
      //   });
      // }, error => console.error(error));
      //
      // this.localNotifications.on(`trigger`).subscribe(next => {
      //   this.storeMiseEnGarde(next);
      // }, error => console.error(error));
    });
  }
  
  storeMiseEnGarde(item) {
    // Création des éléments dans mise en garde
    if (this.misesEnGarde.find(x => x.description === item.text) === undefined) {
      this.services.createSituations({
        date: item.trigger.at,
        titre: item.title,
        description: item.text
      }).then(() => {
      }, error => {
        console.error(error);
      });
    }
  }
  
  deleteSchedules(ids: Array<number>) {
    ids.forEach(id => this.localNotifications.clear(id));
  }
  
  presentDialogAlert(message, duration = 3000, callback: () => void = null) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: duration,
      position: 'bottom'
    });
    
    toast.onDidDismiss(() => {
      if (callback !== null) {
        callback();
      }
    });
    
    toast.present();
  }
  
  makeTakingTreatment(id_alert) {
    return new Promise(resolve => {
      this.localStorage.getKey(v.LOCAL_STRG_TAKED_TREATEMENT).then((res: any) => {
        // this.presentDialogAlert(JSON.stringify(res));
        if (res !== undefined && res !== null) {
          res.push(id_alert);
        } else {
          res = [];
          res.push(id_alert);
        }
        this.localStorage.setKey(v.LOCAL_STRG_TAKED_TREATEMENT, res).then(on => {
          resolve(true);
        });
      });
    })
  }
}
