import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BuildEventPage } from './build-event';
import {NavbarModule} from "../../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    BuildEventPage,
  ],
  imports: [
    IonicPageModule.forChild(BuildEventPage),
    NavbarModule
  ],
})
export class BuildEventPageModule {}
