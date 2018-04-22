import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SignUpModule} from '../pages/sign-up/sign-up.module';
import {ChooseModePageModule} from "../pages/choose-mode/choose-mode.module";
import {ReportPageModule} from "../pages/report/report.module";
import {Img5PageModule} from "../pages/img5/img5.module";
import {Img7PageModule} from "../pages/img7/img7.module";
import {Img6PageModule} from "../pages/img6/img6.module";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),

    SignUpModule,
    ChooseModePageModule,
    ReportPageModule,

    Img5PageModule,
    Img6PageModule,
    Img7PageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
