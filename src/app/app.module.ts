import { FormsModule } from '@angular/forms';
import { MbscModule } from '@mobiscroll/angular';
import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {MyApp} from './app.component';

import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';
import {IonicStorageModule} from '@ionic/storage';
import {AuthenticationProvider} from '../providers/authentication';
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {ServiceProvider} from '../providers/service';
import {LocalStorageProvider} from '../providers/localstorage';
import {Calendar} from "@ionic-native/calendar";
import {Network} from "@ionic-native/network";
import {Camera} from '@ionic-native/camera';
// import {CameraMock} from '../mocks/camera.mock';
import { Vibration } from '@ionic-native/vibration';
import {TranslateHttpLoader} from "@ngx-translate/http-loader";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import { SQLite } from '@ionic-native/sqlite';
import { DatePicker } from '@ionic-native/date-picker';
import { CameraMock } from '@ionic-native-mocks/camera';

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [ 
    FormsModule, 
    MbscModule,
    BrowserModule,
    IonicModule.forRoot(MyApp),
    IonicStorageModule.forRoot({
      name: '_NextBirth_DB',
      driverOrder: ['localstorage', 'indexeddb', 'sqlite', 'websql']
    }),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (createTranslateLoader),
        deps: [HttpClient]
      }
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp
  ],
  providers: [
    StatusBar,
    Calendar,
    Network,
    Vibration,
    LocalStorageProvider,
    SplashScreen,
    SQLite,
    DatePicker,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: Camera, useClass: CameraMock},
    AuthenticationProvider,
    ServiceProvider,
    LocalNotifications
  ]
})
export class AppModule {
}
