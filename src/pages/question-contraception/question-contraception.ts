import {Component} from '@angular/core';
import {AlertController, IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {LocalStorageProvider} from "../../providers/localstorage";
import {ServiceProvider} from "../../providers/service";


@IonicPage()
@Component({
  selector: 'page-question-contraception',
  templateUrl: 'question-contraception.html',
})
export class QuestionContraceptionPage {
  questions = [];
  object = null;
  infos_desir_grossesse = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public localStorage: LocalStorageProvider, public services: ServiceProvider,
              public alertCtrl: AlertController) {
  }

  ionViewDidLoad() {
    this.infos_desir_grossesse = this.navParams.get('infos_desir_grossesse');

    this.object = {
      maritalStatus: null,
      frequenceSaignement: null,
      etatEsprit: null,
      profession: null,
      dureeDesirGrossesse: null,
      diagnostique: null
    }

    if (this.infos_desir_grossesse !== null) {
      this.object = {
        maritalStatus: this.infos_desir_grossesse.marital_status,
        frequenceSaignement: this.infos_desir_grossesse.frequence_saignement,
        etatEsprit: this.infos_desir_grossesse.etat_esprit,
        profession: this.infos_desir_grossesse.profession,
        dureeDesirGrossesse: this.infos_desir_grossesse.duree_desir_grossesse,
        diagnostique: this.infos_desir_grossesse.diagnostique
      }

      console.log(this.object)
    }

    this.getConfigDesirGrossesse()
    console.log('ionViewDidLoad QuestionContraceptionPage')
  }

  getConfigDesirGrossesse() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getConfigDesirGrossesse().subscribe(next => {
      console.log(next);
      this.questions = [
        {
          code: 'maritalStatus',
          libelle: 'Quelle est votre situation ?',
          reponses: next.marital_status,
          choice: this.infos_desir_grossesse !== null ? this.infos_desir_grossesse.marital_status : ''
        },
        {
          code: 'frequenceSaignement',
          libelle: 'Quelle est la fréquence de saignement ?',
          reponses: next.frequence_saignement,
          choice: this.infos_desir_grossesse !== null ? this.infos_desir_grossesse.frequence_saignement : ''
        },
        {
          code: 'etatEsprit',
          libelle: 'Quelle est votre état d\'exprit ?',
          reponses: next.etat_esprit,
          choice: this.infos_desir_grossesse !== null ? this.infos_desir_grossesse.etat_esprit : ''
        },
        {
          code: 'profession',
          libelle: 'Quelle est votre profession ?',
          reponses: next.profession,
          choice: this.infos_desir_grossesse !== null ? this.infos_desir_grossesse.profession : ''
        },
        {
          code: 'dureeDesirGrossesse',
          libelle: 'Depuis combien de temps cherchez vous à concevoir ?',
          reponses: [{key: '1', value: '1'}, {key: '2', value: '2s'}],
          choice: this.infos_desir_grossesse !== null ? this.infos_desir_grossesse.duree_desir_grossesse : ''
        },
        {
          code: 'diagnostique',
          libelle: 'Avez-vous été diagnostiqué ?',
          reponses: [{key: false, value: 'Non'}, {key: true, value: 'Oui'}],
          choice: this.infos_desir_grossesse !== null ? this.infos_desir_grossesse.diagnostique : ''
        }
      ]
    }, error => {
      loading.dismiss()
      console.error(error);
    }, () => {
      loading.dismiss()
    });
  }

  listenChange(event, question) {
    switch (question.code) {
      case 'maritalStatus':
        this.object.maritalStatus = event;
        break;
      case 'frequenceSaignement':
        this.object.frequenceSaignement = event;
        break;
      case 'etatEsprit':
        this.object.etatEsprit = event;
        break;
      case 'dureeDesirGrossesse':
        this.object.dureeDesirGrossesse = event;
        break;
      case 'profession':
        this.object.profession = event;
        break;
      case 'diagnostique':
        this.object.diagnostique = event;
        break;
    }
  }

  checkFieldNotNull() {
    return new Promise((resolve, reject) => {
      if (
        this.object.maritalStatus === null ||
        this.object.frequenceSaignement === null ||
        this.object.etatEsprit === null ||
        this.object.dureeDesirGrossesse === null ||
        this.object.profession === null ||
        this.object.diagnostique === null
      ) {
        reject(false)
      } else {
        resolve(true)
      }
    })
  }

  submit() {
    this.checkFieldNotNull().then(next => {
      let loading = this.loadingCtrl.create();
      loading.present();
      this.services.completeDesirGrossesse(this.object).subscribe(nxt => {
        console.log(nxt);
      }, err => {
        console.error(err);
        loading.dismiss();
      }, () => {
        loading.dismiss();
        loading.onDidDismiss(() => {
          this.navCtrl.setRoot("ReportPage")
        })
      });
    }, error => {
      let alert = this.alertCtrl.create({
        title: 'Erreur',
        message: 'Veuillez remplir tous les champs !',
        buttons: ['Okay']
      });
      alert.present();
    });
  }
}
