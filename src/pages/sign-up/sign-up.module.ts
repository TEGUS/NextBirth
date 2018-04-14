import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';

import {ShowDateModule} from "../../components/show-date/show-date.module";
import {InputElementModule} from "../../components/input-element/input-element.component";
import {SignUpPage} from "./sign-up";
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    SignUpPage,
  ],
  imports: [
    NavbarModule,
    ShowDateModule,
    InputElementModule,
    IonicPageModule.forChild(SignUpPage)
  ],
})
export class SignUpModule {
}
