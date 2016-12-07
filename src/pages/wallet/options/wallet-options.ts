import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-wallet-options',
  templateUrl: 'wallet-options.html'
})
export class WalletOptionsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
  }


  reports(){
    console.log("report");
  }

  withdraw(){
    console.log("withdraw");
  }
  donate(){
    console.log("donate");
  }
  invoice(){
    console.log("invoice");
  }

}
