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
    manufacturerId:any;
    manufacturerName:any;
    models:any;
    cars:Car[];
    mode:any;
    car:Car;

    constructor(public navCtrl:NavController, private navParams:NavParams, private carService:CarService) {

        this.manufacturerId = navParams.get("manufacturerId");
        this.models = this.carService.getModels(this.manufacturerId);
        this.cars = navParams.get("cars");
        this.mode = navParams.get("mode");
        this.car = navParams.get("car");
        this.manufacturerName = this.car.manufacturer;


        console.log(this.car);
    }

    ionViewDidLoad() {
    }

    itemSelected(model) {

        this.car.model = model.name;

        console.log("before navigate ", this.car)
        this.navCtrl.setRoot(AddCarPage, {
            "cars": this.cars,
            "mode": this.mode,
            "car": this.car
        });
    }

}
