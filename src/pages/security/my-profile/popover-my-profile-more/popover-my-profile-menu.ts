import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the PopoverTreatementOptionsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-popover-my-profile-menu',
  template: `
    <ion-list no-border no-padding no-margin>
      <button ion-item tappable *ngFor="let item of menuItems" (click)="close(item)">
        {{item.title}}
      </button>
    </ion-list>
  `
})
export class PopoverMyProfileMenu {
  menuItems = [];
  
  constructor(public navParams: NavParams, public viewCtrl: ViewController) {
    this.menuItems = this.navParams.data.menu;
  }
  
  close(item) {
    console.log(item);
    this.viewCtrl.dismiss(item);
  }
}
