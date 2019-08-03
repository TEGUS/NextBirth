import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AProposPage } from './a-propos';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    AProposPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(AProposPage),
  ],
})
export class AProposPageModule {}
