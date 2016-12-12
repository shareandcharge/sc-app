import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import {AddStationPage} from '../add/add-station'

@Component({
  selector: 'page-my-stations',
  templateUrl: 'my-stations.html'
})

export class MyStationsPage {

  stations:any;

  constructor(public navCtrl: NavController) {

    this.stations = [
      {
        "id" : 1,
        "address" : "dummy address 1",
      },
      {
        "id" : 2,
        "address" : "dummy address 2",
      },
    ];

  }

  ionViewDidLoad() {
  }

  addStation(){
    this.navCtrl.push(AddStationPage);
  }

  editStation(id){
    console.log(id);
  }

}
