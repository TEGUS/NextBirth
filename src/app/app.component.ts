import {Component, ViewChild} from '@angular/core';
import {Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SignUpPage} from "../pages/sign-up/sign-up";
import {ChooseModePage} from "../pages/choose-mode/choose-mode";
import {ReportPage} from "../pages/report/report";
import {Img5Page} from "../pages/img5/img5";
import {Img6Page} from "../pages/img6/img6";
import {Img7Page} from "../pages/img7/img7";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = Img7Page;

  pages: Array<{ title: string, component: any }>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'ReportPage', component: ReportPage},
      {title: 'ChooseMode', component: ChooseModePage},
      {title: 'SignUp', component: SignUpPage},
      {title: 'Img5', component: Img5Page},
      {title: 'Img6', component: Img6Page},
      {title: 'Img7', component: Img7Page}
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }
}
