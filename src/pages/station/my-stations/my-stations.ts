import {Component} from '@angular/core';
import {NavController, ViewController} from 'ionic-angular';
import {AddStationPage} from '../add/add-station';
import {LocationService} from "../../../services/location.service";
import {AuthService} from "../../../services/auth.service";


@Component({
    selector: 'page-my-stations',
    templateUrl: 'my-stations.html',
    providers: [LocationService]
})

export class MyStationsPage {

    stations: any;

    constructor(public navCtrl: NavController, public viewCtrl: ViewController, public auth: AuthService, public locationService: LocationService) {
        this.loadStations();
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

    ionViewDidLoad() {
    }

    addStation() {
        this.navCtrl.push(AddStationPage);
    }

    dismiss() {
        this.viewCtrl.dismiss();
    }

    editStation(id) {
        console.log(id);
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
