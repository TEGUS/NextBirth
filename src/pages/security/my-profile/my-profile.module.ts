import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MyProfilePage } from './my-profile';
import { NavbarModule } from '../../../components/navbar/navbar.module';

@NgModule({
  declarations: [
    MyProfilePage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(MyProfilePage),
  ],
})
export class MyProfileModule {}
