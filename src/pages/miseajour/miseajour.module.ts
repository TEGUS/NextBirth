import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MiseajourPage } from './miseajour';
import { NavbarModule } from '../../components/navbar/navbar.module';

@NgModule({
  declarations: [
    MiseajourPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(MiseajourPage),
  ],
})
export class MiseajourPageModule {}
