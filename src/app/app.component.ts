import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, MenuController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {LocalStorageProvider} from "../providers/localstorage";
import * as codesMode from "../components/mode/mode";
import {FluxReglePage} from '../pages/flux-regle/flux-regle';
import {SurveillancePage} from '../pages/surveillance/surveillance';
import {ServiceProvider} from "../providers/service";
import {TranslateService} from "@ngx-translate/core";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;

  pages: Array<any>;

  constructor(public platform: Platform, public statusBar: StatusBar, public localStorage: LocalStorageProvider,
              public services: ServiceProvider, public menuCtrl: MenuController, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController, public translate: TranslateService) {
    this.services.initHeaders();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Acceuil', component: "Start", icon: 'icon12'},
      {title: 'Profil', component: "MyprofilsPage", icon: 'icon3'},
      {title: 'Calendrier', component: "CalendarPage", icon: 'icon1'},
      {title: 'Mes situations à risque', component: "MessituationarisquePage", icon: 'icon2'},
      {title: 'Mes mises à jour', component: "MiseajourPage", icon: 'icon4'},
      {title: 'Outils surveillance', component: "SurveillancePage", icon: 'icon6'},

      {title: 'FAQ', component: "Img8Page", icon: 'icon7'},
      {title: 'Paramètres', component: "SettingsPage", icon: 'icon8'},
      {title: 'Pilulier', component: "PilulierPage", icon: 'icon9'},
      {title: 'Mise en garde', component: "Img8Page", icon: 'icon10'},
      {title: 'Humeur et état d\'esprit', component: "FluxReglePage", icon: 'icon11'}
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();
      this.statusBar.backgroundColorByHexString("#eb5350");
      this.statusBar.styleLightContent();

      this.menuCtrl.enable(false);
      this.initRootPage().then(page => {
        this.rootPage = page
      });
  
      this.translate.setDefaultLang('fr');
    });
  }

  initRootPage() {
    return new Promise((resolve, reject) => {
      this.localStorage.getKey('session').then(next => {
        if (next !== null) {
          this.menuCtrl.enable(true, 'sideMenu');
          this.localStorage.getKey('mode').then(mode => {
            if (mode !== null) {
              switch (mode.code) {
                case codesMode.CONTPL:
                  resolve("ModeContraceptionPage");
                  break;
                case codesMode.CONTPR:
                  resolve("ModeContraceptionPage");
                  break;
                case codesMode.GRS:
                  let loading = this.loadingCtrl.create();
                  loading.present();
                  this.checkProfileDesirGrossesse().then((next: any) => {
                    loading.dismiss()
                    resolve(next.status ? "ReportPage" : "QuestionContraceptionPage")
                  }, error => {
                    console.error(error)
                    loading.dismiss();
                  })
                  break;
                case codesMode.GEST:
                  resolve("ReportPage")
                  break;
              }
            } else {
              resolve("ChooseModePage")
            }
          });
        } else {
          resolve("LoginPage")
        }
      }, error => {
        console.log(error);
      });
    })
  }

  checkProfileDesirGrossesse() {
    return new Promise((resolve, reject) => {
      this.services.checkProfileDesirGrossesse().subscribe(next => {
        console.log(next)
        resolve(next);
      }, error => {
        reject(error);
      })
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if (page.component != null) {
      switch (page.component) {
        case "Start":
          this.initRootPage().then(page => {
            this.nav.setRoot(page);
          })
          break;
        case "CalendarPage":
          this.localStorage.getKey('mode').then(mode => {
            this.nav.setRoot(
              (mode !== null && mode.code === "MO1") ?
                "TimelinetestPage" : "CalendarPage"
            );
          });
          break;
        default:
          this.nav.setRoot(page.component);
          break;
      }
    }
  }

  signOut() {
    this.localStorage.clearStorage().then(next => {
      this.menuCtrl.enable(false);
      this.nav.setRoot("LoginPage");
    }, error => {
      console.log(error);
    })
  }
}
