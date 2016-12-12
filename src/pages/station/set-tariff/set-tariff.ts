import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {MyStationsPage} from '../my-stations/my-stations';
import {LocationService} from "../../../services/location.service";


@Component({
    selector: 'page-set-tariff',
    templateUrl: 'set-tariff.html',
    providers: [LocationService]

})
export class SetTariffPage {
    locObject: any;
    segmentTabs: any;
    energyRate: any;
    parkRate: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, public locationService: LocationService) {
        this.segmentTabs = 'default';
        this.locObject = this.navParams.get("loc");
        console.log(this.locObject);

    }

    ionViewDidLoad() {
    }

    publish() {
        this.locObject.stations.energyRate = this.energyRate;
        this.locObject.stations.parkRate = this.parkRate;

        this.locationService.createLocation(this.locObject).subscribe(l => {

            this.navCtrl.setRoot(MyStationsPage);
            console.log("created location ", l);
        });

        //this.navCtrl.setRoot(MyStationsPage);
    }

}
