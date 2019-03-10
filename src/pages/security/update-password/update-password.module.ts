import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdatePasswordPage } from './update-password';
import {InputElementModule} from "../../../components/input-element/input-element.component";
import {NavbarModule} from "../../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    UpdatePasswordPage,
  ],
  imports: [
    InputElementModule,
    NavbarModule,
    IonicPageModule.forChild(UpdatePasswordPage),
  ],
})
export class UpdatePasswordPageModule {}
