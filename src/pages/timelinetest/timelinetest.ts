import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

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
      time: {subtitle: '4/16/2013', title: '21:30'}
    },
    {
      title: 'Courgette',
      content: 'Parsley amaranth tigernut .',
      icon: 'calendar',
      time: {subtitle: '4/16/2013', title: '21:30'}
    },
    {
      title: 'Courgette',
      content: 'Parsley amaranth tigernut .',
      icon: 'calendar',
      time: {subtitle: '4/16/2013', title: '21:30'}
    },
    {
      title: 'Courgette daikon',
      content: 'Parsley amaranth tigernut .',
      icon: 'calendar',
      time: {subtitle: 'January', title: '29'}
    },
    {
      title: 'Courgette daikon',
      content: 'Parsley amaranth tigernut .',
      icon: 'calendar',
      time: {subtitle: 'January', title: '31'}
    }
  ]

  constructor(public navCtrl: NavController, public navParams: NavParams) {}

  ionViewDidLoad() {

   
    
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
  icon?: String;
  time: {
    title: String;
    subtitle?: String;
  };
}
