import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessituationarisquePage } from './messituationarisque';
import { NavbarModule } from '../../components/navbar/navbar.module';

@NgModule({
  declarations: [
    MessituationarisquePage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(MessituationarisquePage),
  ],
})
export class MessituationarisquePageModule {}
