import {Component} from '@angular/core';
import {
    NavController,
    ViewController,
    ModalController,
    Events,
    ItemSliding,
    AlertController,
    LoadingController
} from 'ionic-angular';
import {LocationService} from "../../../services/location.service";
import {AuthService} from "../../../services/auth.service";
import {StationWrapperPage} from "../station-wrapper";
import {ErrorService} from "../../../services/error.service";
import {Location} from "../../../models/location";
import {TranslateService} from "@ngx-translate/core";
import {LocationDetailPage} from "../../location/location-details";

@Component({
    selector: 'page-my-stations',
    templateUrl: 'my-stations.html',
    providers: []
})

export class MyStationsPage {

    stations: Array<Location>;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public auth: AuthService,
                private loadingCtrl: LoadingController, private alertCtrl: AlertController,
                public locationService: LocationService, public modalCtrl: ModalController,
                private events: Events, private errorService: ErrorService, private translateService: TranslateService) {
        this.events.subscribe('locations:updated', () => this.loadStations());
    }

    loadStations() {
        if (!this.auth.loggedIn()) {
            this.stations = [];
            return;
        }

        let userAddress;
        userAddress = this.auth.getUser().address;
        this.locationService.getLocationsUser(userAddress).subscribe(locations => {
            this.stations = locations;
        },
        error => this.errorService.displayErrorWithKey(error, 'error.scope.get_locations_user'));
    }

    deleteStation(station, itemSliding: ItemSliding) {
        let alert = this.alertCtrl.create({
            title: this.translateService.instant('station.confirm_delete'),
            message: this.translateService.instant('station.msg_confirm_delete_station'),
            buttons: [
                {
                    text: this.translateService.instant('common.cancel'),
                    role: 'cancel',
                    handler: () => itemSliding.close()
                },
                {
                    text: this.translateService.instant('station.yes_delete'),
                    handler: () => {
                        let loader = this.loadingCtrl.create({
                            content: this.translateService.instant('station.delete_charging_station')
                        });
                        loader.present();
                        this.locationService.deleteLocation(station.id)
                            .finally(() => loader.dismissAll())
                            .subscribe(
                                () => this.events.publish('locations:updated' , station),
                                error => this.errorService.displayErrorWithKey(error, 'error.scope.delete_location')
                            )
                    }
                }
            ]
        });
        alert.present();
    }

    ionViewWillEnter() {
        this.loadStations();
    }

    addStation() {
        let modal = this.modalCtrl.create(StationWrapperPage, {
            "mode": 'add'
        });
        modal.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    stationDetails(location) {
      let locDetails = this.modalCtrl.create(LocationDetailPage, {
        "locationId": location.id,
        "ownerMode": true
      });
      locDetails.present();
    }

    editStation(obj) {
        this.locationService.getLocation(obj.id).subscribe((location) => {
            let modal = this.modalCtrl.create(StationWrapperPage, {
                "location": location,
                "mode": 'edit'
            });
            modal.present();
        },
        error => this.errorService.displayErrorWithKey(error, 'error.scope.get_location'));
    }

    doRefresh(refresher) {
        this.loadStations();
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }

    getImagesWithSrc(location: Location) {
        return this.locationService.getImagesWithSrc(location);
    }
}
