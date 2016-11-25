import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

import {CarService} from "../../services/car.service";
import {Observable} from "rxjs";


@Component({
  selector: 'page-about',
  templateUrl: 'about.html',
  providers: [CarService]

})
export class AboutPage {

  manufacturers: any;
  modelsVw: any;

  constructor(public navCtrl: NavController, private carService: CarService) {

    this.manufacturers = this.carService.getManufacturers();
    this.modelsVw = this.carService.getModels(5);
  }

}
