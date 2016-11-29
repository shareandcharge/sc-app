import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {AddCarPage} from "../add-car/add-car";


@Component({
    selector: 'page-customize-car',
    templateUrl: 'customize-car.html'
})
export class CustomizeCarPage {
    model: any;
    manufacturer: any;
    manufacturerName: any;
    name: any;
    averageDistance: any;
    akkuCapacity: any;
    // numberOfPlugs: any;
    plugTypes: any;
    plateNumber: any;

    selectPlugTypesOptions: {};

    constructor(public navCtrl: NavController, private navParams: NavParams) {
        this.model = navParams.get("model");
        this.manufacturerName = navParams.get("manufacturerName");
        this.plateNumber = navParams.get("plateNumber");

        this.selectPlugTypesOptions = {
            title: 'Select Plug Type'
        };

        if (typeof this.model != "undefined" && typeof this.manufacturerName != "undefined") {
            this.manufacturer = this.manufacturerName;
            this.name = this.model.name;
        }
    }

    ionViewDidLoad() {
        console.log('Hello CustomizeCarPage Page');
    }

    done() {
        this.navCtrl.setRoot(AddCarPage, {
            "manufacturerName": this.manufacturerName,
            "model": this.model,
            "plateNumber": this.plateNumber
        });
    }
}
