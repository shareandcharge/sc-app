import {Component} from "@angular/core";
import {NavParams, Events, NavController} from "ionic-angular";
import {Location} from "../../../../models/location";
import {Station} from "../../../../models/station";
import {Connector} from "../../../../models/connector";
import {User} from "../../../../models/user";
import {UserService} from "../../../../services/user.service";
import {ErrorService} from "../../../../services/error.service";
import {LocationService} from "../../../../services/location.service";

@Component({
    selector: 'tariff-confirmation',
    templateUrl: 'tariff-confirmation.html'
})
export class TariffConfirmationPage {
    location: Location;
    station: Station;
    connector: Connector;
    priceprovider: any;

    pricePerKwh = {
        'public': null,
        'private': null
    };
    parkingFee = {
        'public': null,
        'private': null
    };

    user: User = null;

    estimations = {
        'public': null,
        'private': null
    };

    flowMode: string;

    types = ['public', 'private'];
    names = {
        'public' : 'Community Tarif',
        'private' : 'Familie & Freunde Tarif'
    }

    constructor(private navParams: NavParams, private events: Events, private userService: UserService, private errorService: ErrorService, private locationService: LocationService, private navCtrl: NavController) {
        this.location = navParams.get('location');
        this.station = this.location.stations[0];
        this.connector = this.station.connectors[0];
        this.priceprovider = this.connector.priceprovider;

        this.flowMode = navParams.get('flowMode');

        this.userService.getUser().subscribe((user) => {
            this.user = user;
        },
        (error) => {
            this.errorService.displayErrorWithKey(error, "Lade angemeldeten Nutzer");
        });

        for (let type of this.types) {
            this.loadPrices(type);
        }
    }

    loadPrices(type: string) {
        if (!this.priceprovider[type].active) {
            return;
        }

        this.pricePerKwh[type] = this.priceprovider[type].selected === 'hourly' ? this.priceprovider[type].hourly.hourlyRate : this.priceprovider[type].kwh.kwhRate;
        this.parkingFee[type] = this.priceprovider[type].selected === 'hourly' ? this.priceprovider[type].hourly.parkRate : this.priceprovider[type].kwh.parkRate;

        let pricePerHour, pricePerKW;

        switch (this.priceprovider[type].selected) {
            case 'hourly':
                pricePerHour = this.priceprovider[type].hourly.parkRate;
                pricePerKW = this.priceprovider[type].hourly.hourlyRate;
                break;
            case 'kwh':
                pricePerHour = this.priceprovider[type].kwh.parkRate;
                pricePerKW = this.priceprovider[type].kwh.kwhRate;
                break;
            case 'flatrate':
                pricePerHour = this.priceprovider[type].flatrate.flatrateRate;
                pricePerKW = 0;
                break;
        }

        this.locationService.getEstimatedPrice(pricePerHour, pricePerKW)
            .subscribe(
                (res) => {
                    this.estimations[type] = res;
                },
                error => this.errorService.displayErrorWithKey(error, 'Geschätzter Tarif')
            );
    }

    publish() {
        if (this.flowMode == 'add') {
            this.events.publish('locations:create', this.location);
        } else {
            this.events.publish('locations:update', this.location);
        }
    }

    close() {
        this.navCtrl.parent.pop();
    }
}