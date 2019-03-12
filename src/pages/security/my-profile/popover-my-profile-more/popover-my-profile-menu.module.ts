import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import {PopoverMyProfileMenu} from "./popover-my-profile-menu";

@NgModule({
  declarations: [
    PopoverMyProfileMenu,
  ],
  imports: [
    IonicPageModule.forChild(PopoverMyProfileMenu),
  ],
  exports: [
    PopoverMyProfileMenu,
  ],
})
export class PopoverMyProfileMenuModule {}
