import {Component} from '@angular/core';
import {NavController, ViewController , NavParams} from 'ionic-angular';
import {CarService} from "../../services/car.service";
import {CarModelPage} from "../car-model/car-model";

@Component({
    selector: 'page-car-manufacturer',
    templateUrl: 'car-manufacturer.html',
    providers: [CarService]
})
export class CarManufacturerPage {
    manufacturers: any;
    plateNumber: any;

    constructor(public navCtrl:NavController, private viewCtrl:ViewController , private carService: CarService , private navParams: NavParams) {
        this.manufacturers = this.carService.getManufacturers();
        this.plateNumber = navParams.get("plateNumber");
    }

    ionViewDidLoad() {
        console.log('Hello CarManufacturerPage Page');
    }

    itemSelected(manufacturer){
        this.navCtrl.push(CarModelPage, {
            "manufacturerId": manufacturer.id,
            "manufacturerName": manufacturer.name,
            "plateNumber" : this.plateNumber
        });
    }

    dismiss(data) {
        this.viewCtrl.dismiss(data);
    }

}
