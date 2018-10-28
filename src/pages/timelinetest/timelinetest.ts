import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service';

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

  public avatars:any = [
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

  constructor(public navCtrl: NavController, public loadingCtrl: LoadingController, public services: ServiceProvider, public navParams: NavParams) {}

  ionViewDidLoad() {

    //getAllEvents

    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getAllEvents().subscribe(next => {

      
      console.log("==================================");
      console.log(next);
      console.log("==================================");


    }, error => {
      loading.dismiss();
      console.error(error);
    }, () => {
      loading.dismiss();
    });
    
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
