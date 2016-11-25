import { Component } from '@angular/core';
import { NavController , NavParams } from 'ionic-angular';
import {CarService} from "../../services/car.service";
import {AddCarPage} from "../add-car/add-car";



@Component({
  selector: 'page-car-model',
  templateUrl: 'car-model.html',
  providers: [CarService]
})
export class CarModelPage {
  manufacturerId: any;
  manufacturerName: any;
  models: any;
  constructor(public navCtrl: NavController , private navParams : NavParams , private carService: CarService) {

    this.manufacturerId = navParams.get("manufacturerId");
    this.manufacturerName = navParams.get("manufacturerName");
    this.models = this.carService.getModels(this.manufacturerId);
  }

  ionViewDidLoad() {
  }

  itemSelected(model){
    this.navCtrl.setRoot(AddCarPage, {
      "manufacturerName": this.manufacturerName,
      "model": model
    });
  }

}
