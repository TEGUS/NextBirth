import { NgModule } from '@angular/core';
import {IonicModule} from "ionic-angular";
import { TimelineComponent, TimelineItemComponent, TimelineTimeComponent } from './timeline';


@NgModule({
	declarations: [ 
        TimelineComponent,
        TimelineItemComponent,
        TimelineTimeComponent
    ],
	imports: [IonicModule],
	exports: [
        
        TimelineComponent,
        TimelineItemComponent,
        TimelineTimeComponent
    ]
})

export class TimelineModule {}
