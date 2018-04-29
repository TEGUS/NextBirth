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

  rootPage: any = ReportPage;

  pages: Array<any>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      // {title: 'ReportPage', component: ReportPage, icon: 'calendar'},
      // {title: 'ChooseMode', component: ChooseModePage, icon: 'calendar'},
      // {title: 'SignUp', component: SignUpPage, icon: 'calendar'},
      // {title: 'Img5', component: Img5Page, icon: 'calendar'},
      // {title: 'Img6', component: Img6Page, icon: 'calendar'},
      // {title: 'Img7', component: Img7Page, icon: 'calendar'},

      {title: 'Calendrier', component: null, icon: 'icon1'},
      {title: 'Mes situations à risque', component: null, icon: 'icon2'},
      {title: 'Mon médecin', component: null, icon: 'icon3'},
      {title: 'Mes mises à jour', component: null, icon: 'icon4'},
      {title: 'Gynéco à proximité', component: null, icon: 'icon5'},
      {title: 'Outils surveillance', component: null, icon: 'icon6'},
      {title: 'FAQ', component: null, icon: 'icon7'},
      {title: 'Paramètres', component: null, icon: 'icon8'},
      {title: 'Pilulier', component: null, icon: 'icon9'},
      {title: 'Mise en garde', component: null, icon: 'icon10'},
      {title: 'Humeur et état d\'esprit', component: null, icon: 'icon11'},
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
    if (page.component != null)
      this.nav.setRoot(page.component);
  }
}
