import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimelinetestPage } from './timelinetest';
import { TimelineModule } from '../../../components/timeline/timeline.module';
import { NavbarModule } from '../../../components/navbar/navbar.module';

@NgModule({
  declarations: [
    TimelinetestPage,
  ],
  imports: [
    TimelineModule,
    NavbarModule,
    IonicPageModule.forChild(TimelinetestPage),
  ],
})
export class TimelinetestPageModule {}
