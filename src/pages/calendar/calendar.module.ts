import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {CalendarPage} from './calendar';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    CalendarPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(CalendarPage),
  ],
})
export class CalendarPageModule {
}
