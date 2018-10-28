import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SurveillancePage } from './surveillance';
import { NavbarModule } from '../../components/navbar/navbar.module';


@NgModule({
  declarations: [
    SurveillancePage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(SurveillancePage),
  ],
})
export class SurveillancePageModule {}
