import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the ChargingComplete page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
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
