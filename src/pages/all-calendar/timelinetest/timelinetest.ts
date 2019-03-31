import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {ServiceProvider} from '../../../providers/metier.service';
import {LocalStorageProvider} from "../../../providers/localstorage.service";
import {getCurrentDateWith, getCurrentDateWithout} from "../../../variables/functions";

/**
 * Generated class for the TimelinetestPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timelinetest',
  templateUrl: 'timelinetest.html',
})
export class TimelinetestPage {
  start = 0;
  end = 0;
  public testeur = 0;
  public titre: any;
  public description: any;
  mainInterval = 500;
  
  
  public timelines = [];
  
  public avatars: any = [
    {
      icon: 'icon1.png',
      titre: 'le mokai'
    },
    {
      icon: 'icon2.png',
      titre: 'le mokai'
    },
    {
      icon: 'icon3.png',
      titre: 'le mokai'
    }
  ];
  items: DataTime[] = [
    {
      title: 'Courgette',
      content: 'Parsley amaranth tigernut .',
      icon: 'calendar',
      time: {subTitle: '4/16/2013', title: '21:30'}
    },
    {
      title: 'Courgette',
      content: 'Parsley amaranth tigernut .',
      icon: 'calendar',
      time: {subTitle: '4/16/2013', title: '21:30'}
    },
    {
      title: 'Courgette',
      content: 'Parsley amaranth tigernut .',
      icon: 'calendar',
      time: {subTitle: '4/16/2013', title: '21:30'}
    },
    {
      title: 'Courgette daikon',
      content: 'Parsley amaranth tigernut .',
      icon: 'calendar',
      time: {subTitle: 'January', title: '29'}
    },
    {
      title: 'Courgette daikon',
      content: 'Parsley amaranth tigernut .',
      icon: 'calendar',
      time: {subTitle: 'January', title: '31'}
    }
  ]
  
  debut_dernieres_menstrues = null;
  lastWeekTimeline = null;
  lastEvents = [];
  
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public services: ServiceProvider,
              public navParams: NavParams, public localStorage: LocalStorageProvider,
              public alertCtrl: AlertController) {
  }
  
  ionViewWillEnter() {
    this.start = 0;
    this.end = this.mainInterval;
    this.lastEvents = [];
    
    console.log(this.start)
    console.log(this.end)
    
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getAllEvents(this.start, this.end).subscribe(next => {
      this.services.getDateDernierMenstrues().then(ddm => {
        this.debut_dernieres_menstrues = ddm;
        this.lastWeekTimeline = this.debut_dernieres_menstrues;
  
        console.log(next.data);
        
        this.lastEvents = this.lastEvents.concat(this.buildIntervals(next.data));
        console.log(this.lastEvents);
        
        this.timelines = this.getTimelines(this.lastEvents);
      }, err => console.error(err));
    }, error => {
      loading.dismiss();
      console.error(error);
    }, () => {
      loading.dismiss();
    });
  }
  
  buildIntervals(events) {
    const values = [];
    events.forEach(event => {
      values.push(event);
      
      if (!(event.take_interval instanceof Array)) {
        let interval = [];
        let i = 1;
        while (event.take_interval[i] !== undefined) {
          interval.push(Number(event.take_interval[i++]));
        }
        event.take_interval = interval;
      }
  
      if (event.take_interval.length !== 0) {
        event.take_interval.forEach(interval => {
          let v = {
            // ...event,
            delai_jours_debut: event.delai_jours_debut + Number(interval),
            take_interval: [],
            title: event.event_type,
            content: event.name,
            icon: 'calendar',
            time: {subTitle: '', title: ''}
          };
      
          let d = getCurrentDateWith(this.debut_dernieres_menstrues, v.delai_jours_debut);
      
          v.time.subTitle = d.toDateString();
          v.time.title = v.time.subTitle;
      
          values.push(v);
        });
      }
    });
    return values;
  }
  
  getTimelines(events: Array<any>) {
    const timelines = [];
    
    if (events !== undefined && events !== null && events.length !== 0) {
      let nbJourInterval = 0;
      let elements = [];
      let currentDate = getCurrentDateWith(this.lastWeekTimeline, 0);
      let currentWeek = this.lastWeekTimeline;
      
      while (nbJourInterval <= this.end) {
        events.forEach((event, j) => {
          let currentDateDebutEvent = getCurrentDateWith(this.lastWeekTimeline, event.delai_jours_debut);
          let currentDateFinEvent = getCurrentDateWith(this.lastWeekTimeline, event.delai_jours_fin);
    
          if (currentDate >= currentDateDebutEvent && currentDate <= currentDateFinEvent) {
            elements.push({
              ...event,
              title: event.event_type,
              content: event.name,
              icon: 'calendar',
              time: {subTitle: currentWeek.toDateString(), title: currentWeek.toDateString()}
            });
          }
        });
  
        timelines.push({
          elements: elements,
          icon: 'calendar',
          time: {subTitle: currentWeek.toDateString(), title: currentWeek.toDateString()}
        });
        elements = [];
  
        currentWeek = currentDate;
        nbJourInterval+=7;
        currentDate = getCurrentDateWith(currentDate, 7);
      }
      
      this.lastWeekTimeline = currentWeek;
    }
    return timelines;
  }
  
  selectArticle(content, description) {
    this.testeur = 1;
    this.titre = content;
    this.description = description;
  }
  
  goodArticle() {
    this.testeur = 0;
  }
  
  
  doInfiniteBottom(infiniteScroll) {
    setTimeout(() => {
      // this.items = this.items.concat(this.items);
      // console.log('Async operation has ended');
      
      this.start += this.mainInterval;
      this.end += this.mainInterval;
      
      console.log(this.start)
      console.log(this.end)
      
      this.services.getAllEvents(this.start, this.end).subscribe(next => {
        this.lastEvents = this.buildIntervals(next.data);
        console.log(this.lastEvents);
        
        this.timelines = this.timelines.concat(this.getTimelines(this.lastEvents));
      }, error => {
        console.error(error);
      });
      
      infiniteScroll.complete();
    }, 1000);
  }
  
  addEvent() {
    this.navCtrl.push('BuildEventPage')
  }
  
  updateEvent(event) {
    this.navCtrl.push('BuildEventPage', {
      event: event
    })
  }
  
  deleteEvent(event) {
    let alert = this.alertCtrl.create({
      message: 'Voulez vous continuer ?',
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          handler: () => {}
        },
        {
          text: 'Oui',
          handler: () => {
            let loading = this.loadingCtrl.create()
            loading.present()
            this.services.deleteEvent(event.id).subscribe(next => {
              loading.present()
              this.ionViewWillEnter();
            }, error => {
              console.log(error)
              loading.present()
            })
          }
        }
      ]
    });
  
    alert.present();
  }
  
  openDialog(item) {
    let buttons = [
      {
        text: 'Visualiser',
        handler: () => this.selectArticle(item.content, item.description)
      }
    ];
    
    if (item.patient !== null) {
      buttons = buttons.concat([
        {
          text: 'Modifier',
          handler: () => this.updateEvent(item)
        },
        {
          text: 'Supprimer',
          handler: () => this.deleteEvent(item)
        }
      ])
    }
    
    let alert = this.alertCtrl.create({
      title: `${item.content}`,
      subTitle: `${item.time.subTitle}`,
      buttons: buttons
    });
    alert.present();
  }
}

interface DataTime {
  title: String;
  content: String;
  icon: String;
  time: {
    title: String;
    subTitle?: String;
  };
}
