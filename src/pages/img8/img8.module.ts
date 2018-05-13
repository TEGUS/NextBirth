import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {Img8Page} from './img8';
import {NavbarModule} from "../../components/navbar/navbar.module";
import {InputElementModule} from "../../components/input-element/input-element.component";

@NgModule({
  declarations: [
    Img8Page,
  ],
  imports: [
    NavbarModule,
    InputElementModule,
    IonicPageModule.forChild(Img8Page),
  ],
})
export class Img8PageModule {
}
