import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MonmodalPage } from './monmodal';
import { Camera } from '@ionic-native/camera';
import { Base64 } from '@ionic-native/base64';

@NgModule({
  declarations: [
    MonmodalPage,
  ],
  imports: [
    IonicPageModule.forChild(MonmodalPage),
  ],

  providers:[
    Camera,
    Base64
  ]
})
export class MonmodalPageModule {}
