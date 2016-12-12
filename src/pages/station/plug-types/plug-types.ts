import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {SetTariffPage} from '../set-tariff/set-tariff';

@Component({
  selector: 'page-plug-types',
  templateUrl: 'plug-types.html'
})
export class PlugTypesPage {

  constructor(public navCtrl: NavController) {}

  plugTypes;
  power;
  kwh;

  ionViewDidLoad() {
  }

  nextPage(){
    this.navCtrl.push(SetTariffPage);
  }

}
