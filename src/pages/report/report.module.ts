import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ReportPage} from './report';
import {NavbarModule} from "../../components/navbar/navbar.module";
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';

@NgModule({
  declarations: [
    ReportPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(ReportPage),
  ],
  providers:[
    Camera,
    Base64
  ]
})
export class ReportPageModule {
}
