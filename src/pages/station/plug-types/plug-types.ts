import {Component} from '@angular/core';
import {NavController, NavParams} from 'ionic-angular';
import {SetTariffPage} from '../set-tariff/set-tariff';

@Component({
    selector: 'page-plug-types',
    templateUrl: 'plug-types.html'
})
export class PlugTypesPage {
    locObject: any;
    power: any;
    plugTypes: any;
    kwh: any;

    constructor(public navCtrl: NavController, private navParams: NavParams) {

        this.locObject = this.navParams.get("loc");
        console.log(this.locObject);


    }

    ionViewDidLoad() {
    }

    nextPage() {
        this.locObject.stations.plugTypes = this.plugTypes;
        this.locObject.stations.plugTypes = this.power;

        this.navCtrl.push(SetTariffPage, {
            "loc": this.locObject
        });
    }

}
