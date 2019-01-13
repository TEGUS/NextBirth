import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController, AlertController} from 'ionic-angular';
import {ServiceProvider} from '../../../providers/service';
import {LocalStorageProvider} from "../../../providers/localstorage";
import {getCurrentDateWith} from "../../../variables/functions";

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
  mainInterval = 200;
  
  
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
  
  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public services: ServiceProvider,
              public navParams: NavParams, public localStorage: LocalStorageProvider,
              public alertCtrl: AlertController) {
  }
  
  ionViewWillEnter() {
    this.start = 0;
    this.end = this.mainInterval;
    
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getAllEvents(this.start, this.end).subscribe(next => {
      this.services.getDateDernierMenstrues().then(ddm => {
        console.log(ddm.getDate());
        console.log(ddm.getDay());
        this.debut_dernieres_menstrues = ddm;
        this.timelines = this.getTimelines(next.data);
      }, err => console.error(err));
    }, error => {
      loading.dismiss();
      console.error(error);
    }, () => {
      loading.dismiss();
    });
  }
  
  getTimelines(events: Array<any>) {
    console.log(this.start);
    console.log(this.end);
    let timelines = [];
    if (events !== undefined && events !== null && events.length !== 0) {
      const cache = [];
      const nbJourInterval = 7;
      let timelinestmp = [];
      let firstdebut = events[0].delai_jours_debut + nbJourInterval;
      
      while (cache.length !== events.length) {
        events.forEach((element, j) => {
          if (cache.find(x => element.id === x.id) === undefined && element.delai_jours_debut <= firstdebut) {
            let d = getCurrentDateWith(this.debut_dernieres_menstrues, element.delai_jours_debut);
            
            timelinestmp.push({
              ...element,
              title: element.event_type,
              content: element.name,
              icon: 'calendar',
              time: {subTitle: d.toDateString(), title: d.toDateString()}
            });
            
            if (!(element.take_interval instanceof Array)) {
              let interval = [];
              let i = 1;
              while (element.take_interval[i] !== undefined) {
                interval.push(Number(element.take_interval[i++]));
              }
              element.take_interval = interval;
            }
            
            if (element.take_interval.length !== 0) {
              element.take_interval.forEach(ti => {
                let v = {
                  ...element,
                  delai_jours_debut: element.delai_jours_debut + Number(ti),
                  take_interval: [],
                  title: element.event_type,
                  content: element.name,
                  icon: 'calendar',
                  time: {subTitle: '', title: ''}
                };
                
                let d = getCurrentDateWith(this.debut_dernieres_menstrues, v.delai_jours_debut);
                
                v.time.subTitle = d.toDateString();
                v.time.title = v.time.subTitle;
                
                timelinestmp.push(v);
              });
            }
            
            cache.push(element);
          }
          
          // if (j === (events.length - 1) && timelinestmp.length !== 0) {
          if (j === (events.length - 1)) {
            let d = getCurrentDateWith(this.debut_dernieres_menstrues, (firstdebut - nbJourInterval));
            
            timelines.push({
              elements: timelinestmp,
              icon: 'calendar',
              time: {subTitle: d.toDateString(), title: d.toDateString()}
            });
            timelinestmp = [];
          }
        });
        firstdebut += nbJourInterval;
      }
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
      
      this.services.getAllEvents(this.start, this.end).subscribe(next => {
        this.timelines = this.timelines.concat(this.getTimelines(next.data));
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
