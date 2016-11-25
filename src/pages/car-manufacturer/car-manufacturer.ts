import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {CarService} from "../../services/car.service";
import {CarModelPage} from "../car-model/car-model";

@Component({
    selector: 'page-car-manufacturer',
    templateUrl: 'car-manufacturer.html',
    providers: [CarService]
})
export class CarManufacturerPage {
    manufacturers: any;

    constructor(public navCtrl:NavController, private viewCtrl:ViewController , private carService: CarService) {
        this.manufacturers = this.carService.getManufacturers();
    }

    ionViewDidLoad() {
        console.log('Hello CarManufacturerPage Page');
    }

    itemSelected(manufacturer){
        this.navCtrl.push(CarModelPage, {
            "manufacturerId": manufacturer.id,
            "manufacturerName": manufacturer.name,
        });
    }

    dismiss(data) {
        this.viewCtrl.dismiss(data);
    }

}
