import { Component } from '@angular/core';
import { NavController , ViewController } from 'ionic-angular';




@Component({
  selector: 'page-add-review',
  templateUrl: 'add-review.html'
})
export class AddReviewPage {
  public rate = 2.5;
  constructor(public navCtrl: NavController , public viewCtrl: ViewController) {

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }
}
