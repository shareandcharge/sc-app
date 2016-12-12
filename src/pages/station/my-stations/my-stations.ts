import { Component } from '@angular/core';
import { NavController , ViewController} from 'ionic-angular';
import {AddStationPage} from '../add/add-station';
import {LocationService} from "../../../services/location.service";
import {AuthService} from "../../../services/auth.service";



@Component({
  selector: 'page-my-stations',
  templateUrl: 'my-stations.html',
  providers: [LocationService]
})

export class MyStationsPage {

  stations:any;

  constructor(public navCtrl: NavController , public viewCtrl: ViewController , auth: AuthService, public locationService: LocationService) {


    let userAddress;
    if (this.auth.getUser() != null) {
      userAddress = this.auth.getUser().address;
      this.locationService.getLocationsUser(userAddress).subscribe(locations => {
        this.stations = locations;
        console.log("the cars inside subscribe are ", this.stations);
      });
    }
    else{
      this.locationService.getLocations().subscribe(locations => {
        this.stations = locations;
        console.log("the cars inside subscribe are ", this.stations);
      });

    }



  /*  this.stations = [
      {
        "id": 1,
        "address": "dummy address 1",
      },
      {
        "id": 2,
        "address": "dummy address 2",
      },
    ];
*/

  }


  delete(id){
    this.locationService.deleteLocation(id).subscribe(locations => {
    });
  }

  ionViewDidLoad() {
  }

  addStation(){
    this.navCtrl.push(AddStationPage);
  }

  dismiss(){
    this.viewCtrl.dismiss();
  }

  editStation(id){
    console.log(id);
  }

}
