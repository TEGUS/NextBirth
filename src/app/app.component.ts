import {Component, ViewChild} from '@angular/core';
import {AlertController, LoadingController, MenuController, Nav, Platform} from 'ionic-angular';
import {StatusBar} from '@ionic-native/status-bar';
import {LocalStorageProvider} from "../providers/localstorage";
import * as codesMode from "../components/mode/mode";
import {FluxReglePage} from '../pages/flux-regle/flux-regle';
import {SurveillancePage} from '../pages/surveillance/surveillance';
import {ServiceProvider} from "../providers/service";

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = null;

  pages: Array<any>;

  constructor(public platform: Platform, public statusBar: StatusBar, public localStorage: LocalStorageProvider,
              public services: ServiceProvider, public menuCtrl: MenuController, public loadingCtrl: LoadingController,
              public alertCtrl: AlertController) {
    this.services.initHeaders();
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      {title: 'Acceuil', component: "ReportPage", icon: 'icon1'},
      {title: 'Profil', component: "MyprofilsPage", icon: 'icon3'},
      {title: 'Calendrier', component: "CalendarPage", icon: 'icon1'},
      {title: 'Mes situations à risque', component: "MessituationarisquePage", icon: 'icon2'},
      {title: 'Mes mises à jour', component: "MiseajourPage", icon: 'icon4'},
      {title: 'Outils surveillance', component: "SurveillancePage", icon: 'icon6'},

      {title: 'FAQ', component: "Img8Page", icon: 'icon7'},
      {title: 'Paramètres', component: null, icon: 'icon8'},
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

      this.localStorage.getKey('session').then(next => {
        if (next !== null) {
          this.menuCtrl.enable(true, 'sideMenu');
          this.localStorage.getKey('mode').then(mode => {

            //this.rootPage = "ChooseModePage";
            //this.rootPage = "TimelinetestPage";
            if (mode !== null) {
              switch (mode.code) {
                case codesMode.CONTPL:
                  this.rootPage = "ModeContraceptionPage"
                  break;
                case codesMode.CONTPR:
                  this.rootPage = "ModeContraceptionPage"
                  break;
                case codesMode.GRS:
                  let loading = this.loadingCtrl.create();
                  loading.present();
                  this.checkProfileDesirGrossesse().then((next: any) => {
                    loading.dismiss()
                    this.rootPage = next.status ? "ReportPage" : "QuestionContraceptionPage";
                  }, error => {
                    console.error(error)
                    loading.dismiss();
                  })
                  break;
                case codesMode.GEST:
                  this.rootPage = "ReportPage"
                  break;
              }
            } else {
              this.rootPage = "ChooseModePage"
            }
          });
        } else {
          this.rootPage = "LoginPage";
          //this.rootPage = "TimelinetestPage";
          //this.rootPage = 'FluxReglePage';
        }
      }, error => {
        console.log(error);
      });
    });
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
    if (page.component != null){
      if(page.component==="CalendarPage"){
        
        this.localStorage.getKey('mode').then(mode => {
         
          if (mode !== null) {
              if(mode.code === "MO1"){
                this.nav.setRoot("TimelinetestPage");
              }
          }
        });

      }else{
        this.nav.setRoot(page.component);
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
