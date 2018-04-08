import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';

import {ShowDateModule} from "../../components/show-date/show-date.module";
import {InputElementModule} from "../../components/input-element/input-element.component";
import {SignUpPage} from "./sign-up";

@NgModule({
  declarations: [
    SignUpPage,
  ],
  imports: [
    ShowDateModule,
    InputElementModule,
    IonicPageModule.forChild(SignUpPage)
  ],
})
export class SignUpModule {
}
