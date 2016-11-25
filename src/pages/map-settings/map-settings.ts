import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-map-settings',
  templateUrl: 'map-settings.html'
})
export class MapSettingsPage {

  constructor(public navCtrl: NavController) {}

  ionViewDidLoad() {
    console.log('Hello MapSettingsPage Page');
  }

}
