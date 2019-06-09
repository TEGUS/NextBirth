import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {formatNumberOfDate} from "../../variables/functions";
import {LocalStorageProvider} from "../../providers/localstorage.service";


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
  @ViewChild('datePicker') datePicker;
  @Input() libelle = '';
  @Input() min = null;
  @Input() max = null;
  @Output() outputDate: EventEmitter<any> = new EventEmitter();
  dateToShow = null;
  date = null;
  
  _initValue = null;
  defaultLang = null;

  @Input()
  set initValue(value) {
    if (value) {
      this._initValue = value;
      this.dateChanged(value);
    } else {
      this.dateToShow = {day: 'DD', month: 'MM', year: 'YYYY'}
    }
  };
  
  constructor(public localStorage: LocalStorageProvider) {
    this.dateToShow = {day: 'DD', month: 'MM', year: 'YYYY'}

    this.localStorage.getDefaultLang().then(defaultLang => {
      this.defaultLang = defaultLang;
    });
  }
  
  dateChanged(event) {
    this.dateToShow = event;
    if (this.date === null) {
      this.date = this.dateToShow.date.toISOString();
    }
    this.outputDate.emit(this.dateToShow);
  }

  formatNumberOfDate(val) {
    return Number(val) ? formatNumberOfDate(val) : val;
  }
}
