import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {CarService} from "../../../../services/car.service";
import {LocationService} from "../../../../services/location.service";
import {Location} from "../../../../models/location";
import {Connector} from "../../../../models/connector";
import {Car} from "../../../../models/car";


@Component({
    selector: 'page-charging-complete',
    templateUrl: 'charging-complete.html'
})
export class ChargingCompletePage {
    location: Location;
    connector: Connector;
    chargedTime: any;
    chargedPrice: any;
    activeCar: Car;

    constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private carService: CarService, private locationService: LocationService) {
        this.chargedTime = navParams.get("chargedTime");
        this.location = navParams.get('location');
        this.connector = this.location.stations[0].connectors[0];

    }

    ionViewWillEnter() {
        this.activeCar = this.carService.getActiveCar();

        this.locationService.getPrice(this.connector.id, {
            'timeToLoad': this.chargedTime,
            'wattPower': this.activeCar.maxCharging
        }).subscribe((response) => {
            this.chargedPrice = response.min
        });
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}