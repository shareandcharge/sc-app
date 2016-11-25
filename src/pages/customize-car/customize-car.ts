import { Component } from '@angular/core';
import { NavController ,NavParams} from 'ionic-angular';
import {AddCarPage} from "../add-car/add-car";


/*
  Generated class for the CustomizeCar page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-customize-car',
  templateUrl: 'customize-car.html'
})
export class CustomizeCarPage {
  model: any;
  manufacturer: any;
  manufacturerName: any;
  name: any;
  averageDistance: any;
  akkuCapacity: any;
  numberOfPlugs: any;
  plugTypes: any;
  constructor(public navCtrl: NavController , private navParams: NavParams) {
    this.model = navParams.get("model");
    this.manufacturerName = navParams.get("manufacturerName");

    if(typeof this.model !="undefined" && typeof this.manufacturerName !="undefined"){
      this.manufacturer = this.manufacturerName;
      this.name = this.model.name;

    }
  }

  ionViewDidLoad() {
    console.log('Hello CustomizeCarPage Page');
  }

  done(){
    this.navCtrl.setRoot(AddCarPage);
  }
}
