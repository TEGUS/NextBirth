import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { Img5Page } from './img5';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    Img5Page,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(Img5Page),
  ],
})
export class Img5PageModule {}
