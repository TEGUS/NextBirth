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
