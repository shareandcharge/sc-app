import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CarService} from "../../../services/car.service";
import {AddCarPage} from "../add/add-car";
import {Car} from '../../../models/car';


@Component({
    selector: 'page-car-model',
    templateUrl: 'car-model.html',
    providers: [CarService]
})
export class CarModelPage {
    manufacturerId: any;
    manufacturerName: any;
    models: any;
    mode: any;
    car: Car;

    constructor(public navCtrl: NavController, private navParams: NavParams, private carService: CarService) {

        this.manufacturerId = navParams.get("manufacturerId");
        this.models = this.carService.getModels(this.manufacturerId);
        this.mode = navParams.get("mode");
        this.car = navParams.get("car");
        this.manufacturerName = this.car.manufacturer;
    }

    ionViewDidLoad() {
    }

    itemSelected(model) {

        this.car.model = model.name;
        this.navCtrl.setRoot(AddCarPage, {
            "mode": this.mode,
            "car": this.car
        });
    }

}
