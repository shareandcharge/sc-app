/**
 * Used to display the add-car flow in one modal.
 *
 * Loading this wrapper as modal will create an own navigation controller. This can be used to push pages inside the modal.
 */
import {Component} from "@angular/core";
import {NavParams, NavController, Events} from "ionic-angular";
import {AddStationPage} from "./add/add-station";
import {Location} from "../../models/location";
import {LocationService} from "../../services/location.service";
import {ErrorService} from "../../services/error.service";

@Component({
    selector: 'page-station-wrapper',
    templateUrl: 'station-wrapper.html',
})
export class StationWrapperPage {
    rootPage:any;
    rootParams:any;

    constructor(private params : NavParams, private locationService: LocationService, private navCtrl: NavController, private events: Events, private errorService: ErrorService) {
        this.rootPage = AddStationPage;
        this.rootParams = params;

        this.events.subscribe('locations:update', (location) => this.updateLocation(location));
        this.events.subscribe('locations:create', (location) => this.createLocation(location));
    }

    prepareLocation(location: Location) {
        let station = location.stations[0];
        let connector = station.connectors[0];
        let priceprovider = connector.priceprovider;

        // we need to convert the provider to the format used in the backend
        connector.priceprovider = connector.toBackendPriceProvider(priceprovider);

        return location;
    }

    updateLocation(location: Location) {
        location = this.prepareLocation(location);

        this.locationService.updateLocation(location).subscribe(
            (location) => {
                this.navCtrl.pop();
                this.events.publish('locations:updated', location);
            },
            error => this.errorService.displayErrorWithKey(error, 'Ladestation bearbeiten')
        );
    }

    createLocation(location: Location) {
        location = this.prepareLocation(location);

        this.locationService.createLocation(location).subscribe(
            (location) => {
                this.navCtrl.pop();
                this.events.publish('locations:updated', location);
            },
            error => this.errorService.displayErrorWithKey(error, 'Ladestation hinzufügen')
        );
    }

    ngOnDestroy() {
        this.events.unsubscribe('locations:update');
        this.events.unsubscribe('locations:create');
    }
}