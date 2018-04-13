import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';

import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SignUpModule} from '../pages/sign-up/sign-up.module';
import {SignUpPage} from "../pages/sign-up/sign-up";
import {ChooseModePageModule} from "../pages/choose-mode/choose-mode.module";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    SignUpModule,
    ChooseModePageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    SignUpPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {
}
