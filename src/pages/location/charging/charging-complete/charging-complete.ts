import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';


@Component({
  selector: 'page-charging-complete',
  templateUrl: 'charging-complete.html'
})
export class ChargingCompletePage {
  chargedTime:any;
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.chargedTime = navParams.get("chargedTime");
  }

  ionViewDidLoad() {
    console.log("LOADING COMPONENT");
  }

  ionViewWillLeave() {
    console.log("leaving the page ");
  }

}
