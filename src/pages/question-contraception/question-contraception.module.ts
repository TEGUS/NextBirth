import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { QuestionContraceptionPage } from './question-contraception';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    QuestionContraceptionPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(QuestionContraceptionPage),
  ],
})
export class QuestionContraceptionPageModule {}
