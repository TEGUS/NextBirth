import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ArticleDetailPage } from './article-detail';
import {NavbarModule} from "../../components/navbar/navbar.module";

@NgModule({
  declarations: [
    ArticleDetailPage,
  ],
  imports: [
    NavbarModule,
    IonicPageModule.forChild(ArticleDetailPage),
  ],
})
export class ArticleDetailPageModule {}
