import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorPage } from './error';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    ErrorPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(ErrorPage),
  ],
})
export class ErrorPageModule {}
