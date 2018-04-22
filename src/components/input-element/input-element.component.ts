import {NgModule} from "@angular/core";
import {InputElementComponent} from "./input-element";
import {IonicModule} from "ionic-angular";
import {CommonModule} from "@angular/common";

@NgModule({
  declarations: [
    InputElementComponent
  ],
  imports: [IonicModule, CommonModule],
  exports: [
    InputElementComponent
  ]
})
export class InputElementModule {}
