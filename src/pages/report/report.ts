import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams, AlertController, ModalController, ModalOptions, Modal} from 'ionic-angular';
import { LocalNotifications } from '@ionic-native/local-notifications';
import {ServiceProvider} from "../../providers/service";
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Base64} from '@ionic-native/base64';

@IonicPage()
@Component({
  selector: 'page-report',
  templateUrl: 'report.html',
})
export class ReportPage {
  items = [];

  public noteGrosesse= {
      libele:"",
      description:'0',
      image:'0'
  }

  constructor(public navCtrl: NavController,private modal: ModalController,private alertCtrl: AlertController, private base64: Base64, public navParams: NavParams, private localNotifications: LocalNotifications,
              public loadingCtrl: LoadingController,private camera: Camera, public services: ServiceProvider
  ) {
    // Schedule delayed notification
  }

  ionViewDidLoad() {
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
      trigger: {at: new Date(new Date().getTime() + 60*1000)},
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
            console.log("=============================");
            console.log(data);
            console.log(this.noteGrosesse);
            console.log("=============================");
           
          }
        }
      ]
    });
    alert.present();
  }

  takenote(){
   this.presentPrompt()
  }

  
  takephotos(){

    const options: CameraOptions = {
      quality:100,
      destinationType:1,
      encodingType:this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }

    this.camera.getPicture(options).then((ImageData) => {
          let base64Image = ImageData;
              this.base64.encodeFile(base64Image).then((base64File: string)=>{
                
                this.noteGrosesse.image = base64File;
          
            }, (err) =>{  
          })
           
            
            
        }, (err) =>{

        })
    }


    openModal(){

        const myModalOptions: ModalOptions = {
          enableBackdropDismiss: false
        };
    
        const myModalData = {
          name: 'Paul Halliday',
          occupation: 'Developer'
        };
    
        const myModal: Modal = this.modal.create('MonmodalPage', { data: myModalData }, myModalOptions);
    
        myModal.present();
    
        myModal.onDidDismiss((data) => {
          console.log("I have dismissed.");
          console.log(data);
        });
    
        myModal.onWillDismiss((data) => {
         
        });
  
    }

    mesbonmoment(){
      this.navCtrl.push("MesbonmomentPage", {
      })
    }

    

    

}


