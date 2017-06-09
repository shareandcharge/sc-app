import {Component} from '@angular/core';
import {ViewController} from 'ionic-angular';
import {CarService} from "../../../../services/car.service";
import {LocationService} from "../../../../services/location.service";
import {Location} from "../../../../models/location";
import {Connector} from "../../../../models/connector";
import {Car} from "../../../../models/car";
import {ErrorService} from "../../../../services/error.service";
import {ChargingService} from "../../../../services/charging.service";

@Component({
    selector: 'page-charging-complete',
    templateUrl: 'charging-complete.html'
})
export class ChargingCompletePage {
    location: Location;
    connector: Connector;
    activeCar: Car;
    chargedTime: number;
    chargedTimeString: string;
    chargedPrice: any;

    constructor(private viewCtrl: ViewController, private carService: CarService, private locationService: LocationService,
                private chargingService: ChargingService, private errorService: ErrorService) {
    }

    ionViewWillEnter() {
        this.activeCar = this.carService.getActiveCar();
        this.location = this.chargingService.getLocation();
        this.connector = this.chargingService.getConnector();
        this.chargedTime = this.chargingService.chargedTime();
        this.chargedTimeString = this.makeTimeString(this.chargedTime);

        this.locationService.getPrice(this.connector.id, {
            'secondsToCharge': this.chargedTime,
            'maxCharging': this.activeCar.maxCharging
        }).subscribe((response) => {
                this.chargedPrice = response.min
            },
            error => this.errorService.displayErrorWithKey(error, 'error.scope.get_price')
        );
    }

    makeTimeString(data) {
        let hours = Math.floor(data / 3600);
        let minutes = Math.floor((data % 3600 ) / 60);
        let seconds = Math.floor((data % 3600 ) % 60);

        let h = hours < 10 ? "0" + hours : hours;
        let m = minutes < 10 ? "0" + minutes : minutes;
        let s = seconds < 10 ? "0" + seconds : seconds;

        return h + ':' + m + ':' + s;
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

}