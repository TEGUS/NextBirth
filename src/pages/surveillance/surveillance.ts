import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';

/**
 * Generated class for the SurveillancePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-surveillance',
  templateUrl: 'surveillance.html',
})
export class SurveillancePage {

  public testeur = 0;
  public couleurbouton = 0;
  public timer1:any;
  public timer2:any;
  public timer3:any;
  public contraceptionseconde = 0;
  public contraceptionminutes = 0;
  public contraceptionseconde2 = 0;
  public contraceptionminutes2 = 0;
  public intervalseconde = 0;
  public intervalminutes = 0;
  public testeurdebut = 0;
  public testeurfin = 0;
  public minutecontraception = 0;
  public listesiterval = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public toastCtrl: ToastController) {
    this.testeur = 0;
    this.couleurbouton = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SurveillancePage');
    this.couleurbouton = 0;
  }


  debuter(){

    

      if(this.testeurdebut == 0){
        clearInterval(this.timer2);
        this.couleurbouton =1;
        this.timer1 = setInterval(() => { 
            this.contraceptionseconde = this.contraceptionseconde + 1;
            if(this.contraceptionseconde==60){
              this.contraceptionminutes=this.contraceptionminutes+1;
              this.contraceptionseconde=0;
            }
        }, 1000);

      }else if(this.testeurdebut == 1){
          ///////////////////////////////////////////////////////////////////////////////// 
          // c'est la deuxieme fois qu'on lance le debut de contraception              . //
          /////////////////////////////////////////////////////////////////////////////////
          clearInterval(this.timer2);
          this.testeurfin = 1;
          this.couleurbouton =1;
          this.timer3 = setInterval(() => { 
              this.contraceptionseconde2 = this.contraceptionseconde2 + 1;
              if(this.contraceptionseconde2==60){
                this.contraceptionminutes2=this.contraceptionminutes2+1;
                this.contraceptionseconde2=0;
              }
          }, 1000);

      }
        

  }

  stoper(){
    this.couleurbouton =0;

    

    if(this.testeurfin == 0){
          clearInterval(this.timer1);
          this.testeurdebut = 1;
          this.timer2 = setInterval(() => { 
              this.intervalseconde = this.intervalseconde + 1;
              if(this.intervalseconde==60){
                this.intervalminutes=this.intervalminutes+1;
                this.intervalseconde=0;
              }
          }, 1000);
    }else if(this.testeurfin == 1){
      ///////////////////////////////////////////////////////////////////////////////// 
      // c'est la deuxieme fois qu'on apuis sur stop il faut recommencer le process. //
      /////////////////////////////////////////////////////////////////////////////////
      
      
      // il faut stoker l'interval et reenitialiser.

      

      var element = {
         cle:2,
         minute: this.intervalminutes,
         seconde: this.intervalseconde
      }

      this.listesiterval.push(element);
      var total = 0;
      this.listesiterval.forEach((element,i) => {
           total = total + element.minute*60 + element.seconde;
           if(i == this.listesiterval.length-1){
             this.minutecontraception = total/this.listesiterval.length;
           }
      });

      this.minutecontraception = total/this.listesiterval.length;
      

      clearInterval(this.timer1);
      clearInterval(this.timer2);
      clearInterval(this.timer3);
      this.contraceptionseconde = 0;
      this.contraceptionminutes = 0;
      this.contraceptionseconde2 = 0;
      this.contraceptionminutes2 = 0;
      this.intervalseconde = 0;
      this.intervalminutes = 0;
      this.testeurdebut = 0;
      this.testeurfin = 0;
      
    }
        

    
  }
  

  actionSurOui(){
     this.testeur = 1;
  }


  renitialiser(){
    clearInterval(this.timer1);
    clearInterval(this.timer2);
    this.contraceptionseconde = 0;
    this.contraceptionminutes = 0;
    this.contraceptionseconde2 = 0;
    this.contraceptionminutes2 = 0;
    this.intervalseconde = 0;
    this.intervalminutes = 0;
    this.testeurdebut = 0;
    this.testeurfin = 0;
  }



  colorverdatre(){
    this.presentToast("vous êtes en etas d'arestation lqksl qslmkqlsq qslqsllqs qslqsqlmlkpoeifopezof pefzefopfopefpf fpfeofjfpkpzojfzpeofjzpf pzfjozfopjf"); 
  }

  colorbrunatre(){
    this.presentToast("vous êtes en etas d'arestation lqksl qslmkqlsq qslqsllqs qslqsqlmlkpoeifopezof pefzefopfopefpf fpfeofjfpkpzojfzpeofjzpf pzfjozfopjf"); 
  }

  colortroube(){
    this.presentToast("vous êtes en etas d'arestation lqksl qslmkqlsq qslqsllqs qslqsqlmlkpoeifopezof pefzefopfopefpf fpfeofjfpkpzojfzpeofjzpf pzfjozfopjf"); 
  }

  colorpurulente(){
    this.presentToast("vous êtes en etas d'arestation lqksl qslmkqlsq qslqsllqs qslqsqlmlkpoeifopezof pefzefopfopefpf fpfeofjfpkpzojfzpeofjzpf pzfjozfopjf"); 
  }

  colorclaire(){
    this.presentToast("vous êtes en etas d'arestation lqksl qslmkqlsq qslqsllqs qslqsqlmlkpoeifopezof pefzefopfopefpf fpfeofjfpkpzojfzpeofjzpf pzfjozfopjf");
  }


  presentToast(message: any) {
    let toast = this.toastCtrl.create({
      message: message,
      duration: 5000
    });
    toast.present();
  }




}
