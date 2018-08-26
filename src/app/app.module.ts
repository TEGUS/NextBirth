import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from '@ionic/storage';
import {AuthenticationProvider} from '../providers/authentication';
import {HttpClientModule} from "@angular/common/http";
import {ServiceProvider} from '../providers/service';
import {LocalStorageProvider} from '../providers/localstorage';
import {Calendar} from "@ionic-native/calendar";
import {Network} from "@ionic-native/network";
import {Camera} from '@ionic-native/camera';
import {CameraMock} from '../mocks/camera.mock';

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
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    Calendar,
    Network,
    LocalStorageProvider,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: Camera, useClass: CameraMock},
    AuthenticationProvider,
    ServiceProvider,
    LocalNotifications
  ]
})
export class AppModule {
}
