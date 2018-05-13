import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {Img9Page} from './img9';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    Img9Page,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(Img9Page),
  ],
})
export class Img9PageModule {
}
