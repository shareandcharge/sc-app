import { Component } from '@angular/core';
import { NavController , ViewController } from 'ionic-angular';
import {DashboardPage} from '../dashboard/dashboard'




@Component({
  selector: 'page-add-review',
  templateUrl: 'add-review.html'
})
export class AddReviewPage {
  public rate = 2.5;
  desc:any;
  constructor(public navCtrl: NavController , public viewCtrl: ViewController) {

  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  submitReview(){
    console.log("submit review: rating is : " , this.rate , " : " , this.desc);
    this.viewCtrl.dismiss();
    this.navCtrl.setRoot(DashboardPage);
  }
}
