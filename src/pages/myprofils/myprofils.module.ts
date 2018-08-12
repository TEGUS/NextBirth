import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyprofilsPage } from './myprofils';
import { NavbarModule } from '../../components/navbar/navbar.module';

@NgModule({
  declarations: [
    MyprofilsPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(MyprofilsPage),
  ],
})
export class MyprofilsPageModule {}
