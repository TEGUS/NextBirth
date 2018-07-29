import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FluxReglePage } from './flux-regle';
import { NavbarModule } from '../../components/navbar/navbar.module';

@NgModule({
  declarations: [
    FluxReglePage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(FluxReglePage),
  ],
})
export class FluxReglePageModule {}
