import {Component} from '@angular/core';
import {NavController, ViewController, ModalController, Events} from 'ionic-angular';
import {LocationService} from "../../../services/location.service";
import {AuthService} from "../../../services/auth.service";
import {StationWrapperPage} from "../station-wrapper";


@Component({
    selector: 'page-my-stations',
    templateUrl: 'my-stations.html',
    providers: []
})

export class MyStationsPage {

    stations: Array<Location>;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public auth: AuthService, public locationService: LocationService, public modalCtrl: ModalController, private events: Events) {
        this.events.subscribe('locations:updated', () => this.loadStations());
    }


    loadStations() {
        let userAddress;
        userAddress = this.auth.getUser().address;
        this.locationService.getLocationsUser(userAddress).subscribe(locations => {
            this.stations = locations;
            console.log("the locations inside subscribe are ", this.stations);
        });
    }

    delete(id) {
        this.locationService.deleteLocation(id).subscribe(locations => {
        });
    }

    ionViewWillEnter() {
        this.loadStations();
    }

    ionViewDidLoad() {
    }

    addStation() {
        let modal = this.modalCtrl.create(StationWrapperPage , {
            "mode" : 'add'
        });
        modal.present();
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    editStation(obj) {
        let modal = this.modalCtrl.create(StationWrapperPage , {
            "location": obj,
            "mode": 'edit'
        });
        modal.present();
    }

    favorite(item) {
    }

    share(item) {
    }

    unread(item) {
    }

    doRefresh(refresher) {
        this.loadStations();
        setTimeout(() => {
            console.log('Async operation has ended');
            refresher.complete();
        }, 1000);
    }

}
