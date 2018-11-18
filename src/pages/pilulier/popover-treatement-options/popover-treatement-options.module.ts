import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PopoverTreatementOptionsPage } from './popover-treatement-options';

@NgModule({
  declarations: [
    PopoverTreatementOptionsPage,
  ],
  imports: [
    IonicPageModule.forChild(PopoverTreatementOptionsPage),
  ],
  exports: [
    PopoverTreatementOptionsPage,
  ],
})
export class PopoverTreatementOptionsPageModule {}
