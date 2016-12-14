import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AddCarPage} from "../add/add-car";
import {Car} from '../../../models/car';


@Component({
    selector: 'page-customize-car',
    templateUrl: 'customize-car.html'
})
export class CustomizeCarPage {
    model:any;
    manufacturer:any;
    manufacturerName:any;
    name:any;
    averageDistance:any;
    akkuCapacity:any;
    // numberOfPlugs: any;
    plugTypes:any;
    plateNumber:any;
    car:Car;

    selectPlugTypesOptions:{};
    cars:Car[];
    mode:any;
    selectedPlate:any;

    constructor(public navCtrl:NavController, private navParams:NavParams) {
        this.cars = navParams.get("cars");
        this.mode = navParams.get("mode");
        this.car = navParams.get("car");

        this.selectPlugTypesOptions = {
                title: 'Select Plug Type'
        };

        if (typeof this.car.model != "undefined") {
            this.manufacturer = this.car.manufacturer;
            this.name = this.car.model;
        }
    }

    ionViewDidLoad() {
    }

    done() {
        this.navCtrl.setRoot(AddCarPage, {
            "cars": this.cars,
            "mode": this.mode,
            "car": this.car
        });
    }
}
