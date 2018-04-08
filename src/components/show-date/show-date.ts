import {Component, Input} from '@angular/core';

/**
 * Generated class for the ShowDateComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'show-date',
  templateUrl: 'show-date.html'
})
export class ShowDateComponent {

  @Input() libelle = '';

  constructor() {
  }
}
