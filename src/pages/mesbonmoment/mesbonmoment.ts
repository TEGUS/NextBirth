import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController,  ModalController, ModalOptions, Modal, AlertController, } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service';
import moment from 'moment';


/**
 * Generated class for the MesbonmomentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-mesbonmoment',
  templateUrl: 'mesbonmoment.html',
})
export class MesbonmomentPage {
  public items = [];
  public testeur = 0;
  public libelle: any;
  public description: any;
  public images: any;
  public idbonmoment: any;



  constructor(public loadingCtrl: LoadingController, public alertCtrl: AlertController, private modal: ModalController, public navCtrl: NavController, public services: ServiceProvider,
              public navParams: NavParams, private view: ViewController) {
    this.services.initHeaders();

    moment.locale('fr');
  }

  ionViewDidLoad() {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.getAllNote().subscribe(next => {
          this.items = next;
      }, error => {
        loading.dismiss();
        console.error(error);
      }, () => {
        loading.dismiss();
      });
  }

  selectNode(id, libelle, description, images){
    this.testeur = 1;
    this.idbonmoment = id;
    this.libelle = libelle;
    this.description = description;
    this.images = images;
  }


  parseDate(date, format) {
    var ladate = date.substring(0,16)+'Z'
    return moment(new Date(ladate)).format(format);
  }

  revientsituation(){
    this.testeur = 0;
  }

  suprimemerbonmoment(){

        this.alertCtrl.create({
          message: 'voulez vous vraiment supprimez',
          buttons: [{
              text:'Non',
              handler: data => {
              }
            },{
              text:'Oui',
              handler: data => {
                this.services. deleteBonMoment(this.idbonmoment).subscribe(next => {
                  this.testeur = 0;
                    let loading = this.loadingCtrl.create();
                    loading.present();
                    this.services.getAllNote().subscribe(next => {
                        this.items = next;
                    }, error => {
                      loading.dismiss();
                      console.error(error);
                    }, () => {
                      loading.dismiss();
                    });
                }, error => { 
                }, () => {
                });

              }
            }
            ]
        }).present();
      
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

}
