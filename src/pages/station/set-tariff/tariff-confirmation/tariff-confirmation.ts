import {Component} from "@angular/core";
import {NavParams, Events} from "ionic-angular";
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

    user: User = null;

    estimations = {
        'public' : null,
        'private' : null
    };

    flowMode: string;

    constructor(private navParams: NavParams, private events: Events, private userService: UserService, private errorService: ErrorService, private locationService: LocationService) {
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

        this.loadEstimations('private');
        this.loadEstimations('public');
    }

    loadEstimations(type: string) {
        if (!this.priceprovider[type].active) {
            return;
        }

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
                    console.log(this.estimations);
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
}