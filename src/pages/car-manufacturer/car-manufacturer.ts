import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {CarService} from "../../services/car.service";
import {CarModelPage} from "../car-model/car-model";
import {Car} from '../../models/car';


@Component({
    selector: 'page-car-manufacturer',
    templateUrl: 'car-manufacturer.html',
    providers: [CarService]
})
export class CarManufacturerPage {
    manufacturers:any;
    plateNumber:any;
    mode:any;
    car:Car;
    cars:Car[];
    selectedPlate:any;

    constructor(public navCtrl:NavController, private viewCtrl:ViewController, private carService:CarService, private navParams:NavParams) {
        this.manufacturers = this.carService.getManufacturers();
        this.car = navParams.get("car");
        this.cars = navParams.get("cars");
        this.mode = navParams.get("mode");
    }

    ionViewDidLoad() {
        //console.log('Hello CarManufacturerPage Page');
    }

    itemSelected(manufacturer) {
        this.car.manufacturer = manufacturer.name;
        this.navCtrl.push(CarModelPage, {
            "manufacturerId": manufacturer.id,
            "car": this.car,
            "cars": this.cars,
            "mode": this.mode
        });
    }

    dismiss(data) {
        this.viewCtrl.dismiss(data);
    }

}
