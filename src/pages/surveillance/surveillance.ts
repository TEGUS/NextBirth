import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController } from 'ionic-angular';
import { Vibration } from '@ionic-native/vibration';
import { LocalStorageProvider } from '../../providers/localstorage';
import { LocalNotifications } from '@ionic-native/local-notifications';
import { TimerCounter} from '../../configs/configs';
import { ServiceProvider } from '../../providers/service';

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
  public lacaldouleur = "";
  public testaction = 0;
  public envies = "";
  public frequence = 0;
  public intensite = 0;
  public minutecontraceptionNet: any;
  public listesiterval = [];
  public premierecontraction = 0;
  public montesteur = 0;
  public vallocaldouleur ="rien";
  public couleurduliquide ="rien";
  public madureeenminutes=0;
  public tmp = null;
  public numerateur = 0;
  public denominateur = 0;
  constructor(public navCtrl: NavController,public services: ServiceProvider, private localNotifications: LocalNotifications, public mylocalstorage: LocalStorageProvider, private vibration: Vibration, public navParams: NavParams, public toastCtrl: ToastController) {
    this.testeur = 0;
    this.couleurbouton = 0;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SurveillancePage');
    this.couleurbouton = 0;
    this.minutecontraceptionNet = 0;
  }


  debuter(){
      this.vibration.vibrate(1000);
      if(this.testeurdebut == 0){
        clearInterval(this.timer2);
        this.couleurbouton =1;
        this.timer1 = setInterval(() => {
            this.contraceptionseconde = this.contraceptionseconde + 1;
            if(this.contraceptionseconde==60){
              this.contraceptionminutes=this.contraceptionminutes+1;
              this.contraceptionseconde=0;
            }
            if(this.montesteur==0){
              this.premierecontraction = this.contraceptionseconde*60 + this.contraceptionminutes;
              this.montesteur++;
            }
            
        
        }, 1000);

      }else if(this.testeurdebut == 1){
          /////////////////////////////////////////////////////////////////////////////////
          // c'est la deuxieme fois qu'on lance le debut de contraception              . //
          /////////////////////////////////////////////////////////////////////////////////
          

          ////////////////////////////////////////////////////////
          this.contraceptionminutes2 = this.contraceptionminutes;
          this.contraceptionseconde2 = this.contraceptionseconde;
          ///////////////////////////////////////////////////////
          
          clearInterval(this.timer2);
          this.minutecontraception = (this.contraceptionminutes*60 + this.contraceptionseconde) + (this.intervalminutes*60 + this.intervalseconde);
          var result = this.minutecontraception/60;
          this.minutecontraceptionNet = parseFloat(""+result).toFixed(2)    ;

          this.madureeenminutes = this.minutecontraceptionNet;

          clearInterval(this.timer1);
          clearInterval(this.timer2);
          clearInterval(this.timer3);
          this.contraceptionseconde = 0;
          this.contraceptionminutes = 0;
          //this.contraceptionseconde2 = 0;
          //this.contraceptionminutes2 = 0;
          this.intervalseconde = 0;
          this.intervalminutes = 0;
          this.testeurdebut = 0;
          this.testeurfin = 0;

          clearInterval(this.timer2);
          this.couleurbouton =1;
          this.timer1 = setInterval(() => {
              this.contraceptionseconde = this.contraceptionseconde + 1;
              if(this.contraceptionseconde==60){
                this.contraceptionminutes=this.contraceptionminutes+1;
                this.contraceptionseconde=0;
              }
          }, 1000);
          


          /*this.testeurfin = 1;
          this.couleurbouton =1;
          this.timer3 = setInterval(() => {
              this.contraceptionseconde2 = this.contraceptionseconde2 + 1;
              if(this.contraceptionseconde2==60){
                this.contraceptionminutes2=this.contraceptionminutes2+1;
                this.contraceptionseconde2=0;
              }
          }, 1000);*/




      }
  }

  stoper(){
    this.couleurbouton =0;
    this.vibration.vibrate(1000);

    if(this.testeurfin == 0){
 
          this.premierecontraction = this.contraceptionseconde*60 + this.contraceptionminutes;

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



      /*var element = {
         cle:2,
         minute: this.intervalminutes,
         seconde: this.intervalseconde
      }

      this.listesiterval.push(element);*/
     
      
      /*this.listesiterval.forEach((element,i) => {
           total = total + element.minute*60 + element.seconde;
           if(i == this.listesiterval.length-1){
             this.minutecontraception = total/this.listesiterval.length;
           }
      });*/

      //this.minutecontraception = total/this.listesiterval.length;


      /*clearInterval(this.timer1);
      clearInterval(this.timer2);
      clearInterval(this.timer3);
      this.contraceptionseconde = 0;
      this.contraceptionminutes = 0;
      this.contraceptionseconde2 = 0;
      this.contraceptionminutes2 = 0;
      this.intervalseconde = 0;
      this.intervalminutes = 0;
      this.testeurdebut = 0;
      this.testeurfin = 0;*/
    }




  }


  actionSurOui(){
     this.vibration.vibrate(1000);
     this.testeur = 1;
  }

  actionSurNon(){
    this.vibration.vibrate(1000);
    this.testeur = 0;
  }
  

  
  radioCheckedlocal(events){

    this.vibration.vibrate(1000);
    if(this.lacaldouleur == this.tmp){
      this.lacaldouleur = null;
    }else{
      this.tmp = events;
    }
    if(events == "dv"){
      this.vallocaldouleur = "Ventre"
    }else if((events == "ddv")){
      this.vallocaldouleur = "Dos et Ventre"
    }
    this.frequence = (1/this.minutecontraceptionNet);
  }

 

  radioChecked(events){ 
    this.vibration.vibrate(1000);
    if(this.envies == this.tmp){
      this.envies = null;
    }else{
      this.tmp = events;
    }
    this.frequence = (1/this.minutecontraceptionNet);
  }

  intensitedouleur(valeur){

    this.vibration.vibrate(1000);
    this.testaction = 1;
    this.intensite = valeur/10;
    //0/10; 2/10; 4/10; 6/10; 8/10; 10/10

    this.denominateur = 10;
    this.numerateur = valeur;
        
    if((this.lacaldouleur == "ddv")&&(this.frequence>=(1/10)) && (this.intensite>=(4/10))){
      this.mylocalstorage.getSession().then((result:any) =>{
        this.presentToast("Attention " + result.user.username + " vous serez déjà en train de faire un vrai travail d’accouchement rendez-vous sans trop attendre dans votre maternité pour vous faire examiner.");
        this.declancherAlerte("Attention " + result.user.username + " vous serez déjà en train de faire un vrai travail d’accouchement rendez-vous sans trop attendre dans votre maternité pour vous faire examiner.", 2);
        let situations = {
           date: new Date(),
           titre: "alerte",
           description: "Attention " + result.user.username + " vous serez déjà en train de faire un vrai travail d’accouchement rendez-vous sans trop attendre dans votre maternité pour vous faire examiner."
        }
        this.services.createSituations(situations).then((result) =>{});
     
      })   
    }
    if(((this.envies == "ep")||(this.envies == "efs"))&&(this.premierecontraction>=21600)&&(this.frequence>=(1/5))&& ( (this.contraceptionminutes*60 + this.contraceptionseconde)>60) && (this.intensite>=(8/10))){
      this.mylocalstorage.getSession().then((result:any) =>{
      this.presentToast("Attention " + result.user.username + " votre accouchement est probablement imminent. Vous risquez accoucher dans moins d’une heure. Si vous ne vous rendez pas dans la maternité la plus proche dans un bref délai, vous risquez accoucher dans un cadre inapproprié et mettre en danger la vie de votre bébé et même la vôtre.");
      this.declancherAlerte("Attention " + result.user.username + " votre accouchement est probablement imminent. Vous risquez accoucher dans moins d’une heure. Si vous ne vous rendez pas dans la maternité la plus proche dans un bref délai, vous risquez accoucher dans un cadre inapproprié et mettre en danger la vie de votre bébé et même la vôtre.", 2);
      let situations = {
        date: new Date(),
        titre: "alerte",
        description: "Attention " + result.user.username + " votre accouchement est probablement imminent. Vous risquez accoucher dans moins d’une heure. Si vous ne vous rendez pas dans la maternité la plus proche dans un bref délai, vous risquez accoucher dans un cadre inapproprié et mettre en danger la vie de votre bébé et même la vôtre."
      }
      this.services.createSituations(situations).then((result) =>{});
    
    }) 
    }

    // coooooooooooooooooooooooooooooooolllllllllllllllllllllllllllllllllll
    if((this.intensite>=(8/10))&&(this.frequence>=(4/10))&&((this.contraceptionminutes*60 + this.contraceptionseconde)>60)){
      this.presentToast("Vous risquez une rupture utérine veillez-vous rendre immédiatement dans une maternité au plateau technique élevé");
      this.declancherAlerte("Vous risquez une rupture utérine veillez-vous rendre immédiatement dans une maternité au plateau technique élevé", 2);
      let situations = {
        date: new Date(),
        titre: "alerte",
        description: "Vous risquez une rupture utérine veillez-vous rendre immédiatement dans une maternité au plateau technique élevé"
      }
      this.services.createSituations(situations).then((result) =>{});
   
    }else{
      //this.presentToast(" Votre fœtus subit probablement une souffrance importante. Veillez-vous rendre à la maternité en urgence pour vous faire examiner");
    }


  }



  renitialiser(){
    this.vibration.vibrate(1000);
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
    this.minutecontraception = 0;
    this.minutecontraceptionNet = 0;
  }

  


  colorverdatre(){
    this.vibration.vibrate(1000);
    this.couleurduliquide = "Verdatre";
    /*if((this.intensite>=(8/10))&&(this.frequence>=(4/10))&&((this.contraceptionminutes*60 + this.contraceptionseconde)>60)){
      this.presentToast("Vous risquez une rupture utérine veillez-vous rendre immédiatement dans une maternité au plateau technique élevé ");
    }else{
      this.presentToast(" Votre fœtus subit probablement une souffrance importante. Veillez-vous rendre à la maternité en urgence pour vous faire examiner");
    }*/

    this.presentToast(" Votre fœtus subit probablement une souffrance importante. Veillez-vous rendre à la maternité en urgence pour vous faire examiner");
    this.declancherAlerte("Votre fœtus subit probablement une souffrance importante. Veillez-vous rendre à la maternité en urgence pour vous faire examiner", 2);
    let situations = {
      date: new Date(),
      titre: "alerte",
      description: " Votre fœtus subit probablement une souffrance importante. Veillez-vous rendre à la maternité en urgence pour vous faire examiner"
    }
    this.services.createSituations(situations).then((result) =>{});
  
  }

  colorbrunatre(){
    this.vibration.vibrate(1000);
    this.couleurduliquide = "Brunatre";
    this.presentToast("Attention ! Cet aspect du liquide amniotique peut être signe de danger. Faites-vous examiner sans attendre dans une paternité proche de vous.");
    this.declancherAlerte("Attention ! Cet aspect du liquide amniotique peut être signe de danger. Faites-vous examiner sans attendre dans une paternité proche de vous.", 2);
    let situations = {
      date: new Date(),
      titre: "alerte",
      description: " Attention ! Cet aspect du liquide amniotique peut être signe de danger. Faites-vous examiner sans attendre dans une paternité proche de vous."
    }
    this.services.createSituations(situations).then((result) =>{});
  
  }

  colorsanglant(){
    this.vibration.vibrate(1000);
    this.couleurduliquide = "Sanglant";
    this.presentToast("Les saignements par le vagin au troisième trimestre peuvent être des signes d’une urgence vitale. Faite vous absolument examiner dans une maternité le plutôt possible");
    this.declancherAlerte("Les saignements par le vagin au troisième trimestre peuvent être des signes d’une urgence vitale. Faite vous absolument examiner dans une maternité le plutôt possible", 2);
    let situations = {
      date: new Date(),
      titre: "alerte",
      description: " Les saignements par le vagin au troisième trimestre peuvent être des signes d’une urgence vitale. Faite vous absolument examiner dans une maternité le plutôt possible"
    }
    this.services.createSituations(situations).then((result) =>{});
  
  }

  colortroube(){
    this.vibration.vibrate(1000);
    this.couleurduliquide = "Trouble";
    if((this.contraceptionminutes*60 + this.contraceptionseconde)==0){
        /// ici nous allons ajouter une heure plus tard
        this.presentToast("Vous avez probablement une rupture prématurée de la poche des eaux veillez-vous rendre en urgence dans votre maternité pour vous faire examiner");
        this.declancherAlerte("Vous avez probablement une rupture prématurée de la poche des eaux veillez-vous rendre en urgence dans votre maternité pour vous faire examiner", 2);
        let situations = {
          date: new Date(),
          titre: "alerte",
          description: " Vous avez probablement une rupture prématurée de la poche des eaux veillez-vous rendre en urgence dans votre maternité pour vous faire examiner"
        }
        this.services.createSituations(situations).then((result) =>{});
    
      }else{
      this.presentToast("Soyez rasuré vous êtes probablement en travail veuillez vous rendre dans votre materniitée pour vous faire examiner");
      this.declancherAlerte("Soyez rasuré vous êtes probablement en travail veuillez vous rendre dans votre materniitée pour vous faire examiner", 2);
      let situations = {
        date: new Date(),
        titre: "alerte",
        description: " Soyez rasuré vous êtes probablement en travail veuillez vous rendre dans votre materniitée pour vous faire examiner"
      }
      this.services.createSituations(situations).then((result) =>{});
    
    }
  }

  colorpurulente(){
    this.vibration.vibrate(1000);
    this.couleurduliquide = "Purulente";
    this.presentToast("Attention ! Cet aspect du liquide amniotique peut être signe de danger. Faites-vous examiner sans attendre dans une paternité proche de vous.");
    this.declancherAlerte("Attention ! Cet aspect du liquide amniotique peut être signe de danger. Faites-vous examiner sans attendre dans une paternité proche de vous.", 2);
    let situations = {
      date: new Date(),
      titre: "alerte",
      description: " Attention ! Cet aspect du liquide amniotique peut être signe de danger. Faites-vous examiner sans attendre dans une paternité proche de vous."
    }
    this.services.createSituations(situations).then((result) =>{});
  
  }

  colorclaire(){
    this.vibration.vibrate(1000);
    this.couleurduliquide = "Claire";
    if((this.contraceptionminutes*60 + this.contraceptionseconde)==0){
       /// ici nous allons ajouter une heure plus tard



       TimerCounter.tempsDatente.reload = ()=>{
            try{

                if(TimerCounter.tempsDatente.timer != null){
                    clearInterval(TimerCounter.tempsDatente.timer);
                }	

            }catch(r){
              
            }
        
            TimerCounter.tempsDatente.timer = setInterval(()=>{

              if((this.contraceptionminutes*60 + this.contraceptionseconde)==0){
                  this.presentToast("Vous avez probablement une rupture prématurée de la poche des eaux veillez-vous rendre en urgence dans votre maternité pour vous faire examiner");
                  this.declancherAlerte("Vous avez probablement une rupture prématurée de la poche des eaux veillez-vous rendre en urgence dans votre maternité pour vous faire examiner", 2);
                  clearInterval(TimerCounter.tempsDatente.timer);
                  let situations = {
                    date: new Date(),
                    titre: "alerte",
                    description: " Vous avez probablement une rupture prématurée de la poche des eaux veillez-vous rendre en urgence dans votre maternité pour vous faire examiner"
                  }
                  this.services.createSituations(situations).then((result) =>{});
              
                }
              
            }, TimerCounter.tempsDatente.value);
         }
         
       
        
        TimerCounter.tempsDatente.reload();

        ///////////////////////////////////////////////////////////////////////////////


    }else{
      this.presentToast("Soyez rasuré vous êtes probablement en travail veuillez vous rendre dans votre materniitée pour vous faire examiner");
      this.declancherAlerte("Soyez rasuré vous êtes probablement en travail veuillez vous rendre dans votre materniitée pour vous faire examiner", 2);
      let situations = {
        date: new Date(),
        titre: "alerte",
        description: " Soyez rasuré vous êtes probablement en travail veuillez vous rendre dans votre materniitée pour vous faire examiner"
      }
      this.services.createSituations(situations).then((result) =>{});
    }
    
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
