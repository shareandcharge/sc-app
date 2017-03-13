import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CarService} from "../../../../services/car.service";
import {ErrorService} from "../../../../services/error.service";
import {Car} from '../../../../models/car';


@Component({
    selector: 'page-car-model',
    templateUrl: 'car-model.html',
    providers: []
})
export class CarModelPage {
    manufacturer: any;
    models: any;
    mode: any;
    car: Car;

    constructor(public navCtrl: NavController, private errorService: ErrorService, private navParams: NavParams, private carService: CarService) {

        this.manufacturer = navParams.get("manufacturer");

        this.carService.getModels(this.manufacturer).subscribe((res) => {
                this.models = res;
            },
            error => this.errorService.displayErrorWithKey(error, 'Liste - Meine Autos'));
        this.mode = navParams.get("mode");
        this.car = navParams.get("car");
    }

    itemSelected(model) {

        this.car.model = model.name;
        this.car.accuCapacity = model.battery;
        this.car.maxCharging = model.maxcharging;

        if (this.car.plugTypes.length == 0) {
            this.car.plugTypes = model.plugtype;
        }

        let options = {
            "mode": this.mode,
            "car": this.car
        };

        this.navCtrl.popToRoot(options);
    }

}
