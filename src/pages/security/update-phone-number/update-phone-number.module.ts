import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdatePhoneNumberPage } from './update-phone-number';
import {InputElementModule} from "../../../components/input-element/input-element.component";
import {NavbarModule} from "../../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    UpdatePhoneNumberPage,
  ],
  imports: [
    InputElementModule,
    NavbarModule,
    IonicPageModule.forChild(UpdatePhoneNumberPage),
  ],
})
export class UpdatePhoneNumberPageModule {}
