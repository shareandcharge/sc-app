import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {CarService} from "../../services/car.service";


@Component({
    selector: 'location-details',
    templateUrl: 'location-details.html',
    providers: [CarService]
})
export class LocationDetailPage {
    location: any;

    constructor(public navCtrl: NavController, private navParams: NavParams) {

        this.location = navParams.get("location");
    }

    ionViewDidLoad() {
    }

    itemSelected() {
    }

}
