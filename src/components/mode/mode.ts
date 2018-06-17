import {Component, Input} from '@angular/core';

@Component({
  selector: 'mode',
  templateUrl: 'mode.html'
})
export class ModeComponent {
  @Input() image;
  @Input() libelle;
  @Input() description = 'RAS';

  constructor() {
  }
}

export const GEST = 'MO1';
export const CONTPR = 'MO2';
export const CONTPL = 'MO3';
export const GRS = 'MO4';
