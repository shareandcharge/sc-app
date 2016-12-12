import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {MyStationsPage} from '../my-stations/my-stations'

@Component({
  selector: 'page-set-tariff',
  templateUrl: 'set-tariff.html'
})
export class SetTariffPage {
  segmentTabs:any;
  constructor(public navCtrl: NavController) {
    this.segmentTabs = 'default';

  }

  ionViewDidLoad() {
  }

  publish(){
      this.navCtrl.setRoot(MyStationsPage);
  }

}
