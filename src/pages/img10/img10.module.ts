import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Img10Page } from './img10';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    Img10Page,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(Img10Page),
  ],
})
export class Img10PageModule {}
