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

  items = [
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

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    
  }

}
