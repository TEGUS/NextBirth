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
import {ModeContraceptionPageModule} from "../pages/mode-contraception/mode-contraception.module";
import {QuestionContraceptionPageModule} from "../pages/question-contraception/question-contraception.module";
import {ProfilPageModule} from "../pages/profil/profil.module";
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
import {LocalStorageProvider} from '../providers/localstorage';
import {ArticleDetailPageModule} from "../pages/article-detail/article-detail.module";

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '_NextBirth_DB',
      driverOrder: ['localstorage', 'indexeddb', 'sqlite', 'websql']
    }),
    HttpClientModule,

    SignUpModule,
    LoginPageModule,
    ChooseModePageModule,
    ReportPageModule,
    ModeContraceptionPageModule,
    ProfilPageModule,
    QuestionContraceptionPageModule,
    ArticleDetailPageModule,
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
    // Storage,
    LocalStorageProvider,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthenticationProvider,
    ServiceProvider,
    LocalNotifications
  ]
})
export class AppModule {
}
