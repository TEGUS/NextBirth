import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SendEmailPage } from './send-email';
import {InputElementModule} from "../../../components/input-element/input-element.component";
import {NavbarModule} from "../../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    SendEmailPage,
  ],
  imports: [
    InputElementModule,
    NavbarModule,
    IonicPageModule.forChild(SendEmailPage),
  ],
})
export class SendEmailPageModule {}
