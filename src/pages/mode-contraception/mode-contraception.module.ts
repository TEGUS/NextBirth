import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModeContraceptionPage } from './mode-contraception';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    ModeContraceptionPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(ModeContraceptionPage),
  ],
})
export class ModeContraceptionPageModule {}
