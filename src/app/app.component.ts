import {Component, ViewChild} from '@angular/core';
import {MenuController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {SplashScreen} from '@ionic-native/splash-screen';

import {SignUpPage} from "../pages/sign-up/sign-up";
import {ChooseModePage} from "../pages/choose-mode/choose-mode";
import {ReportPage} from "../pages/report/report";
import {ModeContraceptionPage} from "../pages/modecontraception/mode-contraception";
import {ProfilsPage} from "../pages/profils/profils";
import {QuestionContraceptionPage} from "../pages/question-contraception/question-contraception";
import {Img8Page} from "../pages/img8/img8";
import {Img9Page} from "../pages/img9/img9";
import {Img10Page} from "../pages/img10/img10";
import {Img11Page} from "../pages/img11/img11";
import {LoginPage} from "../pages/login/login";
import {LocalStorageProvider} from "../providers/localstorage";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;

  pages: Array<any>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,
              public localStorage: LocalStorageProvider, public menuCtrl: MenuController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
       {title: 'ReportPage', component: ReportPage, icon: 'calendar'},
       {title: 'ChooseMode', component: ChooseModePage, icon: 'calendar'},
       {title: 'SignUp', component: SignUpPage, icon: 'calendar'},
       {title: 'Mode Contraception', component: ModeContraceptionPage, icon: 'calendar'},
       {title: 'Profils', component: ProfilsPage, icon: 'calendar'},
       {title: 'Question_contraception', component: QuestionContraceptionPage, icon: 'calendar'},
       {title: 'Img8', component: Img8Page, icon: 'calendar'},
       {title: 'Img9', component: Img9Page, icon: 'calendar'},
       {title: 'Img10', component: Img10Page, icon: 'calendar'},

      //{title: 'Calendrier', component: null, icon: 'icon1'},
      //{title: 'Mes situations à risque', component: null, icon: 'icon2'},
      //{title: 'Mon médecin', component: null, icon: 'icon3'},
      //{title: 'Mes mises à jour', component: null, icon: 'icon4'},
      //{title: 'Gynéco à proximité', component: null, icon: 'icon5'},
      //{title: 'Outils surveillance', component: null, icon: 'icon6'},
      //{title: 'FAQ', component: null, icon: 'icon7'},
      //{title: 'Paramètres', component: null, icon: 'icon8'},
      //{title: 'Pilulier', component: null, icon: 'icon9'},
      //{title: 'Mise en garde', component: null, icon: 'icon10'},
      //{title: 'Humeur et état d\'esprit', component: null, icon: 'icon11'},
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.menuCtrl.enable(false);

      this.localStorage.getKey('session').then(next => {
        console.log(next);
        if (next !== null) {
          this.rootPage = ChooseModePage;
          this.menuCtrl.enable(true, 'sideMenu');
        } else {
          this.rootPage = LoginPage;
        }
      }, error => {
        console.log(error);
      });

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

  signOut() {
    this.localStorage.removeKey('session').then(next => {
      this.menuCtrl.enable(false);
      this.nav.setRoot(LoginPage);
    }, error => {
      console.log(error);
    })
  }
}
