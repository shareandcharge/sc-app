import { Component } from '@angular/core';
import { NavController, ViewController } from 'ionic-angular';

@Component({
  selector: 'page-add-money',
  templateUrl: 'add-money.html'
})
export class AddMoneyPage {
  amount:any;
  constructor(public navCtrl: NavController , private viewCtrl: ViewController) {

  }

  ionViewDidLoad() {
  }

  dismiss(){
    this.viewCtrl.dismiss(this.amount);
  }

  addMoney(){
    console.log(this.amount);
    this.viewCtrl.dismiss(this.amount);
  }

}
