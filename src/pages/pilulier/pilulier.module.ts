import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PilulierPage } from './pilulier';
import { NavbarModule } from '../../components/navbar/navbar.module';

@NgModule({
  declarations: [
    PilulierPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(PilulierPage),
  ],
})
export class PilulierPageModule {}
