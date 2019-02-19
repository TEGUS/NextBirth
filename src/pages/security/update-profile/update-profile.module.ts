import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { UpdateProfilePage } from './update-profile';
import {NavbarModule} from "../../../components/navbar/navbar.module";
import {InputElementModule} from "../../../components/input-element/input-element.component";
import {ShowDateModule} from "../../../components/show-date/show-date.module";
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';

@NgModule({
  declarations: [
    UpdateProfilePage,
  ],
  imports: [
    InputElementModule,
    NavbarModule,
    ShowDateModule,
    IonicPageModule.forChild(UpdateProfilePage),
  ],

  providers:[
    Camera,
    Base64
  ]
})
export class ProfilPageModule {}
