import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfilsPage } from './profils';
import {NavbarModule} from "../../components/navbar/navbar.module";
import {InputElementModule} from "../../components/input-element/input-element.component";
import {ShowDateModule} from "../../components/show-date/show-date.module";

@NgModule({
  declarations: [
    ProfilsPage,
  ],
  imports: [
    InputElementModule,
    NavbarModule,
    ShowDateModule,
    IonicPageModule.forChild(ProfilsPage),
  ],
})
export class ProfilsPageModule {}
