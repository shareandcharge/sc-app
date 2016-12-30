import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {SetTariffPage} from '../set-tariff/set-tariff';
import {Location} from "../../../models/location";

@Component({
    selector: 'page-plug-types',
    templateUrl: 'plug-types.html'
})
export class PlugTypesPage {
    locObject: Location;
    power: any;
    plugTypes: any;
    kwh: any;
    flowMode:any;
    powerOptions:any;
    plugOptions:any;
    accessControl:any;

    constructor(public navCtrl: NavController, private navParams: NavParams, public alertCtrl: AlertController) {

        this.accessControl = false;
        this.kwh = false;

        this.powerOptions = [
           "2.4","4.3" ,"6.4"
        ];

        this.plugOptions = [
            "Schuko-Steckdose" , "CEE-Stecker" ,"Typ 1" , "Typ 2" , "Combo" , "CHAdeMO" , "Tesla Supercharger"
        ];

        this.locObject = this.navParams.get("location");
        this.flowMode = this.navParams.get("mode");
        console.log(this.locObject);

        this.plugTypes = [];

        if(typeof this.locObject.stations.plugTypes != 'undefined'){
            this.plugTypes = this.locObject.stations.plugTypes;
        }

        if(typeof this.locObject.stations.power != 'undefined'){
            this.power = this.locObject.stations.power;
        }

        if(typeof this.locObject.stations.accessControl != 'undefined'){
            this.accessControl = this.locObject.stations.accessControl;
        }

        if(typeof this.locObject.stations.kwh != 'undefined'){
            this.kwh = this.locObject.stations.kwh;
        }
    }

    ionViewDidLoad() {
    }

    nextPage() {
        if (this.plugTypes.length > 0) {

            if (!this.accessControl) {
                this.kwh = false
            }

            this.locObject.stations.plugTypes = this.plugTypes;
            this.locObject.stations.power = this.power;
            this.locObject.stations.accessControl = this.accessControl;
            this.locObject.stations.kwh = this.kwh;

            this.navCtrl.push(SetTariffPage, {
                "location": this.locObject,
                "mode": this.flowMode
            });
        } else {
            let alert = this.alertCtrl.create({
                title: 'Bitte wähle einen Steckertyp',
                subTitle: 'Es muss mindestens ein Steckertyp ausgewählt sein.',
                buttons: ['Ok']
            });
            alert.present();
        }

    }

}
