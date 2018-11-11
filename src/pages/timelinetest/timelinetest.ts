import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, LoadingController} from 'ionic-angular';
import {ServiceProvider} from '../../providers/service';
import {el} from "../../../node_modulesback/@angular/platform-browser/testing/src/browser_util";
import {LocalStorageProvider} from "../../providers/localstorage";
import {error} from "util";

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
              public navParams: NavParams, public localStorage: LocalStorageProvider) {
  }
  
  ionViewDidLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getAllEvents().subscribe(next => {
      this.getDateDernierMenstrues().then(ddm => {
        this.debut_dernieres_menstrues = ddm;
        this.timelines = this.getTimelines(next.evenements);
      }, err => console.error(err));
    }, error => {
      loading.dismiss();
      console.error(error);
    }, () => {
      loading.dismiss();
    });
  }
  
  getTimelines(events: Array<any>) {
    let timelines = [];
    const cache = [];
    const nbJourInterval = 14;
    let timelinestmp = [];
    let firstdebut = events[0].delai_jours_debut + nbJourInterval;
    let dateDernierMentrues = this.debut_dernieres_menstrues;
  
    while (cache.length !== events.length) {
      events.forEach((element, j) => {
        if (cache.find(x => element.id === x.id) === undefined && element.delai_jours_debut <= firstdebut) {
          let d = this.debut_dernieres_menstrues;
          d.setDate(dateDernierMentrues.getDate() + element.delai_jours_debut);
          
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
  
              let d = this.debut_dernieres_menstrues;
              d.setDate(dateDernierMentrues.getDate() + v.delai_jours_debut);
              
              v.time.subTitle = d.toDateString();
              v.time.title = v.time.subTitle;
            
              timelinestmp.push(v);
            });
          }
        
          cache.push(element);
        }
      
        if (j === (events.length - 1) && timelinestmp.length !== 0) {
          let d = this.debut_dernieres_menstrues;
          d.setDate(dateDernierMentrues.getDate() + firstdebut - nbJourInterval);
        
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
    return timelines;
  }
  
  getDateDernierMenstrues() {
    return new Promise((resolve, reject) => {
      this.localStorage.getKey('session').then(session => {
        if (session !== null) {
          resolve((new Date((session.user._embedded.patient.debut_dernieres_menstrues).substring(0,16)+'Z')));
        } else {
          reject(false);
        }
      })
    })
  }
  
  doInfiniteBottom(infiniteScroll) {
    setTimeout(() => {
      this.items = this.items.concat(this.items);
      
      console.log('Async operation has ended');
      infiniteScroll.complete();
    }, 500);
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
