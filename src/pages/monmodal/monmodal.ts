import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, LoadingController } from 'ionic-angular';
import { ServiceProvider } from '../../providers/service';
import {Camera, CameraOptions} from '@ionic-native/camera';
import {Base64} from '@ionic-native/base64';

/**
 * Generated class for the MonmodalPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-monmodal',
  templateUrl: 'monmodal.html',
})
export class MonmodalPage {

  public noteGrosesse= {
      libelle:"",
      description:"",
      image:""
  }

  public testeur = 0;

  public imageaafficher = "";


  constructor(private base64: Base64, public loadingCtrl: LoadingController, public navCtrl: NavController,
              private camera: Camera, public services: ServiceProvider, public navParams: NavParams, private view: ViewController) {
  }

  ionViewDidLoad() {
    this.services.initHeaders();
    var data = this.navParams.get('data');
    if(data.image == 1){
        this.takephotos();
    }
  }

  annuler(){
     this.testeur =0;
     this.noteGrosesse = {
          libelle:"",
          description:"",
          image:""
      }

  }

  deleteall(){
    this.noteGrosesse.image = "";
    this.testeur = 0;

  }


  takephotos(){

    
    const options: CameraOptions = {
      quality:100,
      destinationType:1,
      encodingType:this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      sourceType: 1

    }

    this.camera.getPicture(options).then((ImageData) => {
      let base64Image = ImageData;
      this.imageaafficher = "data:image/jpeg;base64," + ImageData;
     
        this.base64.encodeFile(base64Image).then((base64File: string)=>{
            this.testeur = 1;
            this.noteGrosesse.image = "data:image/jpeg;base64," + base64Image;

        }, (err) =>{
          alert(err);
      })



    }, (err) =>{
      alert(err);
    })

    
    }


    takegalerie(){

      

      const options: CameraOptions = {
        quality:100,
        destinationType:0,
        encodingType:this.camera.EncodingType.JPEG,
        mediaType: this.camera.MediaType.PICTURE,
        sourceType: 0

      }

         this.camera.getPicture(options).then((ImageData) => {
            let base64Image = ImageData;
            this.imageaafficher = "data:image/jpeg;base64," + ImageData;
           
              this.base64.encodeFile(base64Image).then((base64File: string)=>{
                  this.testeur = 1;
                  this.noteGrosesse.image = "data:image/jpeg;base64," + base64Image;

              }, (err) =>{
                alert(err);
            })



          }, (err) =>{
            alert(err);
          })
      }


  closeModal() {
    const data = {
      name: 'John Doe',
      occupation: 'Milkman'
    };
    
    this.view.dismiss(data);
  }


  save(){


    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.saveNote(this.noteGrosesse).subscribe(next => {
      this.closeModal()
      
    }, error => {
      loading.dismiss();
      console.error(error);
    }, () => {
      loading.dismiss();
          /*this.navCtrl.push("MesbonmomentPage", {
          })*/
    });

  }

}
