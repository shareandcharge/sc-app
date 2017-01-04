import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {SetTariffPage} from '../set-tariff/set-tariff';
import {Location} from "../../../models/location";
import {Connector} from "../../../models/connector";

@Component({
    selector: 'page-plug-types',
    templateUrl: 'plug-types.html'
})
export class PlugTypesPage {
    locObject: Location;
    connector: Connector;

    flowMode: any;
    powerOptions: any;
    plugOptions: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, public alertCtrl: AlertController) {
        this.powerOptions = [
            "2.4", "4.3", "6.4"
        ];

        this.plugOptions = [
            "Schuko-Steckdose", "CEE-Stecker", "Typ 1", "Typ 2", "Combo", "CHAdeMO", "Tesla Supercharger"
        ];

        this.locObject = this.navParams.get("location");
        this.connector = this.locObject.stations[0].connectors[0];

        this.flowMode = this.navParams.get("mode");
        console.log(this.locObject);
    }

    nextPage() {
        if (this.connector.plugtype != '') {

            if (!this.connector.metadata.accessControl) {
                this.connector.metadata.kwh = false
            }

            this.navCtrl.push(SetTariffPage, {
                "location": this.locObject,
                "mode": this.flowMode
            });
        } else {
            let alert = this.alertCtrl.create({
                title: 'Bitte wähle einen Steckertyp',
                subTitle: 'Es muss ein Steckertyp ausgewählt sein.',
                buttons: ['Ok']
            });
            alert.present();
        }

    }

    showHelp(type) {
        let message = "";

        if ("accessControl" === type) {
            message = "Wähle diese Option sofern deine Ladestation über WLAN, GSM, sowie einen " +
                "Light Client verfügt, der die Ladestation über die Share&Charge App steuern kann.";
        }
        else if ("kwh" === type) {
            message = "Wähle diese Option sofern dein Ladepunkt über einen geeichten Stromzähler verfügt " +
                "& der Zählerstand automatisch an das Share&Charge Backend gesendet wird.";
        }

        let alert = this.alertCtrl.create({
            title: 'Info',
            message: message,
            buttons: ['Ok']
        });
        alert.present();
    }

    close() {
        this.navCtrl.parent.pop();
    }

}
