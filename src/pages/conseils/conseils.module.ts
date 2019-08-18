import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConseilsPage } from './conseils';
import { NavbarModule } from '../../components/navbar/navbar.module';

@NgModule({
  declarations: [
    ConseilsPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(ConseilsPage),
  ],
})
export class ConseilsPageModule {}
