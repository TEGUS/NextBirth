import {Component} from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ServiceProvider} from "../../providers/service";
import {ArticleDetailPage} from "../article-detail/article-detail";

@IonicPage()
@Component({
  selector: 'page-mode-contraception',
  templateUrl: 'mode-contraception.html',
})
export class ModeContraceptionPage {

  items = [];
  title = '';

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public services: ServiceProvider) {
    this.title = this.navParams.get('title') == null ? 'Mode de Contraception' : this.navParams.get('title');
  }

  ionViewDidLoad() {
    let loading = this.loadingCtrl.create();
    loading.present();
    this.services.getArticles().subscribe(next => {
      console.log(next);
      this.items = next
    }, error => {
      loading.dismiss();
      console.error(error);
    }, () => {
      loading.dismiss();
    });

    console.log('ionViewDidLoad ModeContraceptionPage');
  }

  selectArticle(id) {
    console.log(id);
    this.navCtrl.push(ArticleDetailPage, {
      id: id
    })
  }
}
