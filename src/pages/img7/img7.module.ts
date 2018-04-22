import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Img7Page } from './img7';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    Img7Page,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(Img7Page),
  ],
})
export class Img7PageModule {}
