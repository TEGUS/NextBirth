import {Component} from '@angular/core';
import {
  IonicPage,
  LoadingController,
  NavController,
  NavParams,
  AlertController,
  ModalController,
  ModalOptions,
  Modal
} from 'ionic-angular';
import {LocalNotifications} from '@ionic-native/local-notifications';
import {ServiceProvider} from "../../providers/service";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Base64} from '@ionic-native/base64';
import { LocalStorageProvider } from '../../providers/localstorage';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  items = [];

  public noteGrosesse = {
    libele: "",
    description: '0',
    image: '0'
  }

  public nombresemaine: any;
  public nombrejourrestant: any;
  public dpa: any;

  constructor(public navCtrl: NavController, public mylocalstorage: LocalStorageProvider, private modal: ModalController, private alertCtrl: AlertController,
              private base64: Base64, public navParams: NavParams, private localNotifications: LocalNotifications,
              public loadingCtrl: LoadingController, private camera: Camera, public services: ServiceProvider) {
    this.services.initHeaders();
  }

  ionViewDidLoad() {

   
   
    this.mylocalstorage.getSession().then((result:any) =>{

      
      var dataprofile = '' + result.user._embedded.patient.debut_dernieres_menstrues;
      console.log(dataprofile);
      var ladate = dataprofile.substring(0,16)+'Z';
      var premieredate = new Date(ladate).getTime();
      var dateaujourdui = new Date().getTime();
      var nombremilliseconde = dateaujourdui - premieredate;
      var nombresjours = Math.ceil( ((((nombremilliseconde/1000)/60)/60)/24));
      var nomrejoursavantacc = 280 - nombresjours;
      this.nombrejourrestant = (nombresjours) % 7;
      this.nombresemaine = Math.floor((nombresjours) / 7);
      var time = new Date().getTime();
      var dateaccouchement = new Date(time + nomrejoursavantacc*24*60*60*1000);  
      this.dpa = dateaccouchement.toLocaleDateString("fr");
     
    // 280 jour pour donné naissance
      
    })
 


    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getArticles().subscribe(next => {
      

      this.items = next
    }, error => {
      loading.dismiss();
      console.error(error);
    }, () => {
      loading.dismiss();
    });

    console.log('ionViewDidLoad ReportPage');
    this.localNotifications.schedule({
      text: 'Debut du seignement dans  une semaine',
      trigger: {at: new Date(new Date().getTime() + 60 * 1000)},
      led: 'FF0000',
      sound: 'file://assets/imgs/notification.mp3'
    });
  }

  selectArticle(id) {
    console.log(id);
    this.navCtrl.push("ArticleDetailPage", {
      id: id
    })
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
      image:1,
      note:0
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
      image:0,
      note:1
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


}


