import { Component } from '@angular/core';
import {IonicPage, LoadingController, NavController, NavParams} from 'ionic-angular';
import {ServiceProvider} from "../../providers/metier.service";

/**
 * Generated class for the ArticleDetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-article-detail',
  templateUrl: 'article-detail.html',
})
export class ArticleDetailPage {
  article = null
  title = ''

  constructor(public navCtrl: NavController, public navParams: NavParams,
              public loadingCtrl: LoadingController, public services: ServiceProvider) {
    this.services.initHeaders();
  }

  ionViewDidLoad() {
    if (!this.navParams.data.hasOwnProperty('id')) {
      this.navCtrl.pop();
    } else {
      let loading = this.loadingCtrl.create();
      loading.present();
      
      this.services.getArticle(this.navParams.get('id')).subscribe(next => {
        console.log(next);
        this.article = next;
        this.title = this.article.title
      }, error => {
        loading.dismiss();
        console.error(error);
      }, () => {
        loading.dismiss();
      });
    }
  }

}
