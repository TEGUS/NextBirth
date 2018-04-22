import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Img6Page } from './img6';
import {NavbarModule} from "../../components/navbar/navbar.module";
import {InputElementModule} from "../../components/input-element/input-element.component";

@NgModule({
  declarations: [
    Img6Page,
  ],
  imports: [
    InputElementModule,
    NavbarModule,
    IonicPageModule.forChild(Img6Page),
  ],
})
export class Img6PageModule {}
