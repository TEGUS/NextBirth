import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MesbonmomentPage } from './mesbonmoment';
import { NavbarModule } from '../../components/navbar/navbar.module';

@NgModule({
  declarations: [
    MesbonmomentPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(MesbonmomentPage),
  ],
})
export class MesbonmomentPageModule {}
