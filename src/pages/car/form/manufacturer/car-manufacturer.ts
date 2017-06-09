import {Component} from '@angular/core';
import {NavController, ViewController, NavParams} from 'ionic-angular';
import {CarService} from "../../../../services/car.service";
import {ErrorService} from "../../../../services/error.service";
import {CarModelPage} from "../model/car-model";
import {Car} from '../../../../models/car';


@Component({
    selector: 'page-car-manufacturer',
    templateUrl: 'car-manufacturer.html',
    providers: []
})
export class CarManufacturerPage {
    manufacturers: any;
    plateNumber: any;
    mode: any;
    car: Car;

    constructor(public navCtrl: NavController, private errorService: ErrorService, private viewCtrl: ViewController, private carService: CarService, private navParams: NavParams) {
        this.carService.getManufacturers().subscribe((res) => {
                this.manufacturers = res;
            },
            error => this.errorService.displayErrorWithKey(error, 'error.scope.get_manufacturers'));

        this.car = navParams.get("car");
        this.mode = navParams.get("mode");
    }

    itemSelected(manufacturer) {
        this.car.manufacturer = manufacturer;
        this.navCtrl.push(CarModelPage, {
            "manufacturer": manufacturer,
            "car": this.car,
            "mode": this.mode
        });
    }

    dismiss(data) {
        this.viewCtrl.dismiss(data);
    }

}
