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
  selector: 'page-popover-treatement-options',
  template: `
    <ion-list>
      <button ion-item (click)="close(1)">Mettre à jour</button>
      <button ion-item (click)="close(2)">Supprimer</button>
    </ion-list>
  `
})
export class PopoverTreatementOptionsPage {
  
  constructor(public navParams: NavParams, public viewCtrl: ViewController) {}
  
  close(type) {
    console.log(type);
    this.viewCtrl.dismiss(type);
  }
}
