import {NgModule} from '@angular/core';
import {IonicPageModule} from 'ionic-angular';
import {ChooseModePage} from './choose-mode';
import {InputElementModule} from "../../components/input-element/input-element.component";
import {ModeModule} from "../../components/mode/mode.module";
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    ChooseModePage,
  ],
  imports: [
    NavbarModule,
    InputElementModule,
    ModeModule,
    IonicPageModule.forChild(ChooseModePage),
  ],
})
export class ChooseModePageModule {
}
