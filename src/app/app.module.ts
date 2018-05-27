import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from '@ionic/storage';
import {SignUpModule} from '../pages/sign-up/sign-up.module';
import {ChooseModePageModule} from "../pages/choose-mode/choose-mode.module";
import {ReportPageModule} from "../pages/report/report.module";
import {Img5PageModule} from "../pages/img5/img5.module";
import {Img7PageModule} from "../pages/img7/img7.module";
import {Img6PageModule} from "../pages/img6/img6.module";
import {Img8PageModule} from "../pages/img8/img8.module";
import {Img9PageModule} from "../pages/img9/img9.module";
import {Img10PageModule} from "../pages/img10/img10.module";
import {Img11PageModule} from "../pages/img11/img11.module";
import {Img12PageModule} from "../pages/img12/img12.module";
import {Img13PageModule} from "../pages/img13/img13.module";
import {AuthenticationProvider} from '../providers/authentication';
import {HttpClientModule} from "@angular/common/http";
import {LoginPageModule} from "../pages/login/login.module";
import {ServiceProvider} from '../providers/service';
import {LocalstorageProvider} from '../providers/localstorage';

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot(),
    HttpClientModule,

    SignUpModule,
    LoginPageModule,
    ChooseModePageModule,
    ReportPageModule,
    Img5PageModule,
    Img6PageModule,
    Img7PageModule,
    Img8PageModule,
    Img9PageModule,
    Img10PageModule,
    Img11PageModule,
    Img12PageModule,
    Img13PageModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    Storage,
    LocalstorageProvider,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    ServiceProvider,
    LocalNotifications
  ]
})
export class AppModule {
}
