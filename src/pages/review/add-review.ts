import { Component } from '@angular/core';
import { NavController , ViewController } from 'ionic-angular';


@Component({
  selector: 'page-add-review',
  templateUrl: 'add-review.html'
})
export class AddReviewPage {
  private rate = 2;
  constructor(public navCtrl: NavController , public viewCtrl: ViewController) {

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
