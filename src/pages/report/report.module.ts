import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ReportPage} from './report';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    ReportPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(ReportPage),
  ],
})
export class ReportPageModule {
}
