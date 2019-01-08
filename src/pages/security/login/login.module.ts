import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {LoginPage} from './login';
import {InputElementModule} from "../../../components/input-element/input-element.component";

@NgModule({
  declarations: [
    LoginPage,
  ],
  imports: [
    InputElementModule,
    IonicPageModule.forChild(LoginPage),
  ],
})
export class LoginPageModule {
}
