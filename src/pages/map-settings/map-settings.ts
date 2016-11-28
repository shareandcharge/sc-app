import { Component } from '@angular/core';
import { NavController , ViewController } from 'ionic-angular';


@Component({
  selector: 'page-map-settings',
  templateUrl: 'map-settings.html'
})
export class MapSettingsPage {
  mapView: 'roadMap';

  constructor(public navCtrl: NavController , private viewCtrl: ViewController) {}

  ionViewDidLoad() {
    //console.log('Hello MapSettingsPage Page');
  }

  setMapView(selected){
    this.viewCtrl.dismiss(selected);

  }
  
}
