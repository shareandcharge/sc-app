import {Component} from '@angular/core';

import {NavController} from 'ionic-angular';

import {CarService} from "../../services/car.service";
import {LocationDetailPage} from "../location/location-details";
import {Observable} from "rxjs";


@Component({
    selector: 'page-about',
    templateUrl: 'about.html',
    providers: [CarService]

})
export class AboutPage {

    manufacturers: any;
    modelsVw: any;

    constructor(public navCtrl: NavController, private carService: CarService) {

        this.manufacturers = this.carService.getManufacturers();
        this.modelsVw = this.carService.getModels(5);
    }

    testLocationDetails() {
        let location = {
            "id": 1,
            "owner": "cb7f00b318513870f477c6d78bf478023e5e481f",
            "name": "Intuitive asynchronous challenge",
            "description": "non velit donec diam neque vestibulum eget vulputate ut ultrices",
            "images": [
                "http://dummyimage.com/400x300.jpg/dddddd/000000",
                "http://dummyimage.com/400x300.jpg/5fa2dd/ffffff"
            ],
            "latitude": "51.1646",
            "longitude": "6.7519",
            "address": "9716 Westerfield Center",
            "_country": "Germany",
            "city": "Neuss",
            "stations": [
                {
                    "name": "tortor",
                    "connectors": [
                        {
                            "status": 4,
                            "plugType": 1
                        }
                    ]
                }
            ]
        };

        this.navCtrl.push(LocationDetailPage, {
            "location": location
        });
    }
}
