import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConseilPage } from './conseil';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    ConseilPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(ConseilPage),
  ],
})
export class ConseilPageModule {}
