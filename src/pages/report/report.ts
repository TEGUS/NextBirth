import {Component} from '@angular/core';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  ModalOptions,
  Modal,
  ToastController
} from 'ionic-angular';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {ServiceProvider} from "../../providers/service";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Base64} from '@ionic-native/base64';
import {LocalStorageProvider} from '../../providers/localstorage';
import {DatePicker} from '@ionic-native/date-picker';


@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  items = [];
  
  public testeurdpv = 0;
  public testeurdpvcac = 0;
  
  public noteGrosesse = {
    libele: "",
    description: '0',
    image: '0'
  }
  
  public nombresemaine: any;
  public nombrejourrestant: any;
  public dpa: any; 
  public dpv: any; 
  public dpvacc: any; 
  public imageaafficher = "";
  acticlesSubscription:any;

  constructor(public navCtrl: NavController, public mylocalstorage: LocalStorageProvider,public toastCtrl: ToastController, private modal: ModalController, private alertCtrl: AlertController,
              private base64: Base64, public navParams: NavParams, private localNotifications: LocalNotifications,
              public loadingCtrl: LoadingController, private camera: Camera, public services: ServiceProvider, private datePicker: DatePicker) {
    
    this.testeurdpv = 0;
    this.testeurdpvcac = 0;
    this.services.initHeaders();
  }
  
  ionViewWillEnter() {
    
    
   // this.mylocalstorage.setObjectUpdateProfile(this.object);
    this.mylocalstorage.getObjectUpdateProfile().then(mode => {
         if(mode==null){
          this.navCtrl.push('ProfilPage');
         }
    });
   

    this.mylocalstorage.getSession().then((result:any) =>{
        this.imageaafficher = result.user._embedded.photo;
    })


        this.mylocalstorage.getKeydpv().then((result:any) =>{ 
           
            var dateaujourdui = new Date().getTime();
            var datepv = result;
            var nombremilliseconde = datepv - dateaujourdui;
            var nombresjours = Math.ceil(((((nombremilliseconde/1000)/60)/60)/24));
            

            if(nombresjours>0){
              this.dpv = nombresjours;
              this.testeurdpv = 1;
            }else if(nombresjours==1){

              // Bonjour Rahim n'oubliez pas votre visite demain demain 
              this.mylocalstorage.getSession().then((result:any) =>{
                this.presentToast("Bonjour " + result.user.username + " svp n'oubliez pas votre visite demain");
                this.declancherAlerte("Bonjour " + result.user.username + " svp n'oubliez pas votre visite demain", 2);
              }) 

            }else{
              this.testeurdpv = 0;
            }
        });



        this.mylocalstorage.getKeydpvacc().then((result:any) =>{ 
           
            var dateaujourdui = new Date().getTime();
            var datepv = result;
            var nombremilliseconde = datepv - dateaujourdui;
            var nombresjours = Math.ceil(((((nombremilliseconde/1000)/60)/60)/24));
            

            if(nombresjours>0){
              this.dpvacc = nombresjours;
              this.testeurdpvcac = 1;
            }else if(nombresjours==1){

              // Bonjour Rahim n'oubliez pas votre vaccin demain 

              this.mylocalstorage.getSession().then((result:any) =>{
                this.presentToast("Bonjour " + result.user.username + " svp n'oubliez pas votre visite demain demain");
                this.declancherAlerte("Bonjour " + result.user.username + " svp n'oubliez pas votre visite demain demain", 2);
              }) 

            }else{
              this.testeurdpvcac = 0;
            }
        });


      this.mylocalstorage.getSession().then((result:any) =>{
        var dataprofile = '' + result.user._embedded.patient.debut_dernieres_menstrues;
        var ladate = dataprofile.substring(0,16)+'Z';
        var premieredate = new Date(ladate).getTime();
        var dateaujourdui = new Date().getTime();
        var nombremilliseconde = dateaujourdui - premieredate;
        var nombresjours = Math.ceil( ((((nombremilliseconde/1000)/60)/60)/24));
        var nomrejoursavantacc = 280 - nombresjours;
        if(nomrejoursavantacc<0){
          this.navCtrl.setRoot('ChooseModePage', {});
        }
        this.nombrejourrestant = (nombresjours) % 7;
        this.nombresemaine = Math.floor((nombresjours) / 7);
        var time = new Date().getTime();
        var dateaccouchement = new Date(time + nomrejoursavantacc*24*60*60*1000);  
        this.dpa = dateaccouchement.toLocaleDateString("fr");
      
        var dateaujourdui = new Date().getTime();
        var datepv = result;
        var nombremilliseconde = datepv - dateaujourdui;
        var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
        
        
        if (nombresjours > 0) {
          this.dpv = nombresjours;
          this.testeurdpv = 1;
        } else {
          this.testeurdpv = 0;
        }
    });
    
    
    this.mylocalstorage.getKeydpvacc().then((result: any) => {
      
      var dateaujourdui = new Date().getTime();
      var datepv = result;
      var nombremilliseconde = datepv - dateaujourdui;
      var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
      
      
      if (nombresjours > 0) {
        this.dpvacc = nombresjours;
        this.testeurdpvcac = 1;
      } else {
        this.testeurdpvcac = 0;
      }
    });
    
    
    this.mylocalstorage.getSession().then((result: any) => {
      var dataprofile = '' + result.user._embedded.patient.debut_dernieres_menstrues;
      var ladate = dataprofile.substring(0, 16) + 'Z';
      var premieredate = new Date(ladate).getTime();
      var dateaujourdui = new Date().getTime();
      var nombremilliseconde = dateaujourdui - premieredate;
      var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
      var nomrejoursavantacc = 280 - nombresjours;
      if(nomrejoursavantacc<0){
        this.navCtrl.setRoot('ChooseModePage', {});
      }
      this.nombrejourrestant = (nombresjours) % 7;
      this.nombresemaine = Math.floor((nombresjours) / 7);
      var time = new Date().getTime();
      var dateaccouchement = new Date(time + nomrejoursavantacc * 24 * 60 * 60 * 1000);
      this.dpa = dateaccouchement.toLocaleDateString("fr");
      
      // 280 jour pour donné naissance
      
    })

    
    let loading = this.loadingCtrl.create();
    loading.present();
    this.acticlesSubscription = this.services.getArticles().subscribe(next => {
      this.items = next
    }, error => {
      loading.dismiss();
      console.error(error);
    }, () => {
      loading.dismiss();
    });
    
    console.log('ionViewDidLoad ReportPage');
    /*this.localNotifications.schedule({
      text: 'Debut du seignement dans  une semaine',
      trigger: {at: new Date(new Date().getTime() + 60 * 1000)},
      led: 'FF0000',
      sound: 'file://assets/imgs/notification.mp3'
    });*/
  }
  
  // ionViewWillLeave() {
  //   if (this.acticlesSubscription !== null) {
  //     this.acticlesSubscription.unsubscribe();
  //   }
  // }
  //
  // ionViewDidLeave() {
  //   if (this.acticlesSubscription !== null) {
  //     this.acticlesSubscription.unsubscribe();
  //   }
  // }
  
  selectArticle(id) {
    console.log(id);
    this.navCtrl.push("ArticleDetailPage", {
      id: id
    })
  }
  
  
  datapick() {
    
    let alert = this.alertCtrl.create({
      title: 'Date Prochain Visite',
      message: 'Voulez vous renseigner la date de la prochaine visite ?',
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          handler: () => {
            
          
          }
        },
        {
          text: 'OUI',
          handler: () => {
            
            
            this.datePicker.show({
              date: new Date(),
              mode: 'date',
              androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
            }).then((date) => {
              
              //var datepv = new Date(JSON.stringify(date)).getTime();
              var dateaujourdui = new Date().getTime();
              var datepv = date.getTime();
              var nombremilliseconde = datepv - dateaujourdui;
              var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
              this.dpv = nombresjours;
              if (this.dpv > 0) {
                this.mylocalstorage.storeKeydpv(datepv).then(() => {
                });
                this.testeurdpv = 1;
              }
              
            });
            
            
          }
        }
      ]
    });
    
    alert.present();
    
  }
  
  
  dateprochainvacc() {
    
    let alert = this.alertCtrl.create({
      title: 'Date Prochain Vaccin',
      message: 'Voulez vous renseigner la date du prochain vaccin ?',
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          handler: () => {
            
          
          }
        },
        {
          text: 'OUI',
          handler: () => {
            
            
            this.datePicker.show({
              date: new Date(),
              mode: 'date',
              androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
            }).then((date) => {

                //var datepv = new Date(JSON.stringify(date)).getTime();
                var data = { 
                  "date_visite": date
                }
            
                this.services.dateprochaineVisite(data).subscribe(next => {
                  this.items = next
                }, error => {
                }, () => {
                });
                var dateaujourdui = new Date().getTime();
                var datepv = date.getTime();
                var nombremilliseconde = datepv - dateaujourdui;
                var nombresjours = Math.ceil(((((nombremilliseconde/1000)/60)/60)/24));
                this.dpvacc = nombresjours;
                if(this.dpvacc>0){
                  this.mylocalstorage.storeKeydpvacc(datepv).then(() => {});
                  this.testeurdpvcac = 1;
                }
            
            });
            
            
          }
        }
      ]
    });
    
    alert.present();
    
  }
  
  
  dateprodacc() {
    
    
    /*this.mylocalstorage.getSession().then((result:any) =>{
          console.log("=========================================");
          result.user._embedded.patient.debut_dernieres_menstrues = "madateepuis quoi"
          console.log(result.user._embedded.patient.debut_dernieres_menstrues );
          console.log("=========================================");
    })*/
    
    let alert = this.alertCtrl.create({
      title: 'Date Probable accouchement',
      message: 'Voulez vous metre à jours votre date de dernier règle ?',
      buttons: [
        {
          text: 'NON',
          role: 'cancel',
          handler: () => {
            
          
          }
        },
        {
          text: 'OUI',
          handler: () => {
            
            
            this.datePicker.show({
              date: new Date(),
              mode: 'date',
              androidTheme: this.datePicker.ANDROID_THEMES.THEME_HOLO_DARK
            }).then((date) => {
              
              //var datepv = new Date(JSON.stringify(date)).getTime();
              // update profile date des dernier règles
              
              this.mylocalstorage.getSession().then((result: any) => {
                result.user._embedded.patient.debut_dernieres_menstrues = date;
                this.mylocalstorage.storeSession(result).then(() => {
                  // c'est update doit aussi aller au serveur

                        this.mylocalstorage.getSession().then((result: any) => {
                          var dataprofile = '' + result.user._embedded.patient.debut_dernieres_menstrues;
                           // this.mylocalstorage.setObjectUpdateProfile(this.object);
                          this.mylocalstorage.getObjectUpdateProfile().then((mode: any) => {
                                if(mode!=null){
                                   mode.debut_dernieres_menstrues = dataprofile.substring(0, 16) + 'Z';
                                   this.services.updateprofile(mode).subscribe(next => {
                                    this.mylocalstorage.updatePatientStorage(next);
                                  }, error => {
                                  }, () => {
                                    this.mylocalstorage.setObjectUpdateProfile(mode);
                                  });
                                }
                          });
                          var ladate = dataprofile.substring(0, 16) + 'Z';
                          var premieredate = new Date(ladate).getTime();
                          var dateaujourdui = new Date().getTime();
                          var nombremilliseconde = dateaujourdui - premieredate;
                          var nombresjours = Math.ceil(((((nombremilliseconde / 1000) / 60) / 60) / 24));
                          var nomrejoursavantacc = 280 - nombresjours;
                          this.nombrejourrestant = (nombresjours) % 7;
                          this.nombresemaine = Math.floor((nombresjours) / 7);
                          var time = new Date().getTime();
                          var dateaccouchement = new Date(time + nomrejoursavantacc * 24 * 60 * 60 * 1000);
                          this.dpa = dateaccouchement.toLocaleDateString("fr");
                          
                          // 280 jour pour donné naissance
                          
                        })
                  
                });
              })
              
            });
            
            
          }
        }
      ]
    });
    
    alert.present();
    
  }
  
  
  presentPrompt() {
    let alert = this.alertCtrl.create({
      title: 'Bien Voiloir saisir le bon moment',
      inputs: [
        {
          name: 'libele',
          placeholder: 'libele'
        },
        {
          name: 'description',
          placeholder: 'Description'
          
        }
      
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.noteGrosesse.libele = data.libele;
            this.noteGrosesse.description = data.description;
          }
        }
      ]
    });
    alert.present();
  }
  
  takenote() {
    this.presentPrompt()
  }
  
  
  takephotos() {
    
    const options: CameraOptions = {
      quality: 100,
      destinationType: 1,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    
    this.camera.getPicture(options).then((ImageData) => {
      let base64Image = ImageData;
      this.base64.encodeFile(base64Image).then((base64File: string) => {
        
        this.noteGrosesse.image = base64File;
        
      }, (err) => {
      })
      
      
    }, (err) => {
    
    })
  }
  
  
  openModalImage() {
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    
    const myModalData = {
      name: 'Paul Halliday',
      occupation: 'Developer',
      image: 1,
      note: 0
    };
    
    const myModal: Modal = this.modal.create('MonmodalPage', {data: myModalData}, myModalOptions);
    
    myModal.present();
    
    myModal.onDidDismiss((data) => {
    });
    
    myModal.onWillDismiss((data) => {
    
    });
    
  }
  
  
  openModalNote() {
    
    const myModalOptions: ModalOptions = {
      enableBackdropDismiss: false
    };
    
    const myModalData = {
      name: 'Paul Halliday',
      occupation: 'Developer',
      image: 0,
      note: 1
    };
    
    const myModal: Modal = this.modal.create('MonmodalPage', {data: myModalData}, myModalOptions);
    
    myModal.present();
    
    myModal.onDidDismiss((data) => {
    });
    
    myModal.onWillDismiss((data) => {
    
    });
    
  }
  
  mesbonmoment() {
    this.navCtrl.push("MesbonmomentPage", {})
  }


  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 10000
    });
    toast.present();
  }

  declancherAlerte(message: any, nombreseconde: any) {

    this.localNotifications.schedule({
      text: message,
      trigger: {at: new Date(new Date().getTime() + nombreseconde * 1000)},
      led: 'FF0000',
      sound: 'file://assets/imgs/notification.mp3'
    });

  }



}


