import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SettingsPage } from './settings';
import {NavbarModule} from "../../components/navbar/navbar.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
  declarations: [
    SettingsPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(SettingsPage),
    TranslateModule.forChild()
  ],
})
export class SettingsPageModule {}
