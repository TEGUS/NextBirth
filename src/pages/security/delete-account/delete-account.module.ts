import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DeleteAccountPage } from './delete-account';
import {InputElementModule} from "../../../components/input-element/input-element.component";
import {NavbarModule} from "../../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    DeleteAccountPage,
  ],
  imports: [
    InputElementModule,
    NavbarModule,
    IonicPageModule.forChild(DeleteAccountPage),
  ],
})
export class DeleteAccountPageModule {}
