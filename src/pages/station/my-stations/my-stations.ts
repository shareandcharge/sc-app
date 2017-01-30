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

@Component({
    selector: 'page-my-stations',
    templateUrl: 'my-stations.html',
    providers: []
})

export class MyStationsPage {

    stations: Array<Location>;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public auth: AuthService, private loadingCtrl: LoadingController, private alertCtrl: AlertController, public locationService: LocationService, public modalCtrl: ModalController, private events: Events, private errorService: ErrorService) {
        this.events.subscribe('locations:updated', () => this.loadStations());
    }


    loadStations() {
        let userAddress;
        userAddress = this.auth.getUser().address;
        this.locationService.getLocationsUser(userAddress).subscribe(locations => {
            this.stations = locations;
        },
        error => this.errorService.displayErrorWithKey(error, 'Liste - Stationen des Benutzers'));
    }


    deleteStation(station, itemSliding: ItemSliding) {
        let alert = this.alertCtrl.create({
            title: 'Löschen bestätigen',
            message: 'Möchtest Du diese Station wirklich löschen?',
            buttons: [
                {
                    text: 'Abbrechen',
                    role: 'cancel',
                    handler: () => itemSliding.close()
                },
                {
                    text: 'Ja, löschen',
                    handler: () => {
                        let loader = this.loadingCtrl.create({content: "Lösche Station ..."});
                        loader.present();
                        this.locationService.deleteLocation(station.id)
                            .finally(() => loader.dismissAll())
                            .subscribe(
                                () => this.events.publish('locations:updated' , station),
                                error => this.errorService.displayErrorWithKey(error, 'Station löschen')
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

    editStation(obj) {
        this.locationService.getLocation(obj.id).subscribe((location) => {
            let modal = this.modalCtrl.create(StationWrapperPage, {
                "location": location,
                "mode": 'edit'
            });
            modal.present();
        },
        error => this.errorService.displayErrorWithKey(error, 'Station laden'));
    }

    doRefresh(refresher) {
        this.loadStations();
        setTimeout(() => {
            refresher.complete();
        }, 1000);
    }
}
