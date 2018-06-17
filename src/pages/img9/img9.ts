import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {Calendar} from "@ionic-native/calendar";
import {LocalStorageProvider} from "../../providers/localstorage";

/**
 * Generated class for the Img9Page page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-img9',
  templateUrl: 'img9.html',
})
export class Img9Page {
  date: any;
  daysInThisMonth: any;
  daysInLastMonth: any;
  daysInNextMonth: any;
  monthNames: string[];
  currentMonth: any;
  currentYear: any;
  currentDate: any;
  eventList: any;
  selectedEvent: any;
  isSelected: any;


  previousMonth: any = 'month';
  nextMonth: any = 'month';

  events = [];

  constructor(public navCtrl: NavController, public navParams: NavParams, private calendar: Calendar,
              public localStorage: LocalStorageProvider) {
    this.calculCycleMenstruel();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad Img9Page');
  }

  ionViewWillEnter() {
    this.date = new Date();
    this.monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    this.getDaysOfMonth();
  }

  getDaysOfMonth() {
    this.daysInThisMonth = new Array();
    this.daysInLastMonth = new Array();
    this.daysInNextMonth = new Array();
    this.currentMonth = this.monthNames[this.date.getMonth()];
    this.currentYear = this.date.getFullYear();

    if (this.date.getMonth() === new Date().getMonth()) {
      this.currentDate = new Date().getDate();
    } else {
      this.currentDate = 999;
    }

    this.previousMonth = (this.date.getMonth() - 1) === -1 ? this.monthNames[11] : this.monthNames[this.date.getMonth() - 1];
    this.nextMonth = (this.date.getMonth() + 1) === 12 ? this.monthNames[0] : this.monthNames[this.date.getMonth() + 1];

    var firstDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth(), 1).getDay();
    var prevNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth(), 0).getDate();
    for (var i = prevNumOfDays - (firstDayThisMonth - 1); i <= prevNumOfDays; i++) {
      this.daysInLastMonth.push({
        day: i,
        color: null
      });
    }

    var thisNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();
    for (var i = 0; i < thisNumOfDays; i++) {
      let event = this.events.find(e => e.date.getFullYear() === this.date.getFullYear() && e.date.getMonth() === this.date.getMonth() && e.date.getDate() === i + 1)
      this.daysInThisMonth.push({
        day: i + 1,
        color: event !== undefined ? event.color : 'white'
      });
    }

    var lastDayThisMonth = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDay();
    var nextNumOfDays = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0).getDate();
    for (var i = 0; i < (6 - lastDayThisMonth); i++) {
      this.daysInNextMonth.push({
        day: i + 1,
        color: null
      });
    }
    var totalDays = this.daysInLastMonth.length + this.daysInThisMonth.length + this.daysInNextMonth.length;
    if (totalDays < 36) {
      for (var i = (7 - lastDayThisMonth); i < ((7 - lastDayThisMonth) + 7); i++) {
        this.daysInNextMonth.push({
          day: i,
          color: null
        });
      }
    }
  }

  goToLastMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth(), 0);
    this.getDaysOfMonth();
  }

  goToNextMonth() {
    this.date = new Date(this.date.getFullYear(), this.date.getMonth() + 2, 0);
    this.getDaysOfMonth();
  }

  selectDate(day) {
    console.log(day)
    // this.isSelected = false;
    // this.selectedEvent = new Array();
    // var thisDate1 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 00:00:00";
    // var thisDate2 = this.date.getFullYear()+"-"+(this.date.getMonth()+1)+"-"+day+" 23:59:59";
    // this.eventList.forEach(event => {
    //   if(((event.startDate >= thisDate1) && (event.startDate <= thisDate2)) || ((event.endDate >= thisDate1) && (event.endDate <= thisDate2))) {
    //     this.isSelected = true;
    //     this.selectedEvent.push(event);
    //   }
    // });
  }

  calculCycleMenstruel() {
    return new Promise((resolve) => {
      this.localStorage.getKey('session').then(session => {
        let events = []
        let patient = session.user._embedded.patient
        // patient.duree_cycle = 28
        // patient.duree_saignement = 4

        //DateDebutDernierRegle
        let dateDebutDernierRegle = new Date(patient._embedded.infoEvolution.debut_dernieres_menstrues)

        this.initSaignementOvulation(dateDebutDernierRegle, patient);

        //Etablicement du cycle sur 6 mois
        let newDateDebutDernierRegle = new Date(dateDebutDernierRegle)
        for (let i = 1; i < 6; i++) {
          let nbJours = patient.duree_cycle * i
          newDateDebutDernierRegle.setDate(dateDebutDernierRegle.getDate() + nbJours)
          this.initSaignementOvulation(newDateDebutDernierRegle ,patient)
          newDateDebutDernierRegle = new Date(dateDebutDernierRegle)
        }

        resolve(this.events)
      })
    })
  }

  initSaignementOvulation(dateDebutDernierRegle, patient) {
    //Date Debut des dernières règles
    this.events.push({
      color: 'red',
      date: dateDebutDernierRegle
    })

    //Période de saignement de puis le debut des dernieres règles
    let dateFinSaignement = new Date(dateDebutDernierRegle)
    for (let i = 1; i < patient.duree_saignement; i++) {
      dateFinSaignement.setDate(dateDebutDernierRegle.getDate() + i)
      this.events.push({
        color: 'red',
        date: dateFinSaignement
      })
      dateFinSaignement = new Date(dateDebutDernierRegle)
    }

    //DateOvulation
    let dateOvulation = new Date(dateDebutDernierRegle)
    dateOvulation.setDate(dateOvulation.getDate() + (patient.duree_cycle - 14))
    this.events.push({
      color: 'darkgreen',
      date: dateOvulation
    })

    //Période Préovulatoire
    let datePreOvul_start = new Date(dateOvulation)
    for (let i = 1; i < 4; i++) {
      datePreOvul_start.setDate(dateOvulation.getDate() - i)
      this.events.push({
        color: 'mediumseagreen',
        date: datePreOvul_start
      })
      datePreOvul_start = new Date(dateOvulation)
    }

    //Période Postovulatoire
    let datePostOvul_start = new Date(dateOvulation)
    for (let i = 1; i < 3; i++) {
      datePostOvul_start.setDate(dateOvulation.getDate() + i)
      this.events.push({
        color: 'mediumseagreen',
        date: datePostOvul_start
      })
      datePostOvul_start = new Date(dateOvulation)
    }
  }
}
