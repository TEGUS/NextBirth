import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Generated class for the InputElementComponent component.
 *
 * See https://angular.io/api/core/Component for more info on Angular
 * Components.
 */
@Component({
  selector: 'input-element',
  templateUrl: 'input-element.html'
})
export class InputElementComponent {
  
  @Input() libelle = '';
  @Input() type = '';
  
  @Input() min = null;
  @Input() max = null;
  
  _initValue = null
  
  @Input()
  set initValue(value) {
    this._initValue = value;
    this.inputChange({value: value});
  };
  
  @Input() direction = 'column';
  @Input() textPosition = 'left';
  @Input() widthComponentInput = '100%';
  
  @Output() outputValue: EventEmitter<any> = new EventEmitter()
  
  constructor() {
  }
  
  inputChange(event) {
    this.outputValue.emit(event.value);
  }
}
