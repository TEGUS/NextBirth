import { NgModule } from '@angular/core';
import {IonicModule} from "ionic-angular";
import { TimelineComponent } from './timeline/timeline';

@NgModule({
	declarations: [TimelineComponent],
	imports: [IonicModule],
	exports: [TimelineComponent]
})
export class ComponentsModule {}
