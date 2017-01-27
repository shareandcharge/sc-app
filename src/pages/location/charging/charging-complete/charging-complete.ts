import {Component} from '@angular/core';
import {NavController, NavParams, ViewController} from 'ionic-angular';
import {CarService} from "../../../../services/car.service";
import {LocationService} from "../../../../services/location.service";
import {Location} from "../../../../models/location";
import {Connector} from "../../../../models/connector";
import {Car} from "../../../../models/car";
import {ErrorService} from "../../../../services/error.service";


@Component({
    selector: 'page-charging-complete',
    templateUrl: 'charging-complete.html'
})
export class ChargingCompletePage {
    location: Location;
    connector: Connector;
    chargedTime: any;
    chargedTimeString: any;
    chargedPrice: any;
    activeCar: Car;

    constructor(public navCtrl: NavController, public navParams: NavParams, private viewCtrl: ViewController, private carService: CarService, private locationService: LocationService, private errorService: ErrorService) {
        this.chargedTime = navParams.get("chargedTime");
        this.chargedTimeString = this.makeTimeString(this.chargedTime);
        this.location = navParams.get('location');
        this.connector = this.location.stations[0].connectors[0];
    }

    ionViewWillEnter() {
        this.activeCar = this.carService.getActiveCar();

        this.locationService.getPrice(this.connector.id, {
            'secondsToCharge': this.chargedTime,
            'maxCharging': this.activeCar.maxCharging
        }).subscribe((response) => {
            this.chargedPrice = response.min
        },
        error => this.errorService.displayErrorWithKey(error, 'Preisabfrage'));
    }

    makeTimeString(data) {
        let hours = Math.floor(data / 3600);
        let minutes = Math.floor((data % 3600 ) / 60);
        let seconds = Math.floor((data % 3600 ) % 60);

        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        let finalString = h + ':' + m + ':' + s;
        return finalString;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}