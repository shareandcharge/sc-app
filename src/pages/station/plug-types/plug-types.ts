import {Component} from '@angular/core';
import {NavController, NavParams, AlertController} from 'ionic-angular';
import {SetTariffPage} from '../set-tariff/set-tariff';
import {Location} from "../../../models/location";
import {Connector} from "../../../models/connector";
import {ConfigService} from "../../../services/config.service";

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

    wattpowerTemp: any;
    errorMessages: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, public alertCtrl: AlertController, private configService: ConfigService) {
        this.powerOptions = [
            "2.4", "4.3", "6.4"
        ];

        this.configService.getPlugTypes().subscribe((plugtypes) => {
            this.plugOptions = plugtypes;
            console.log(this.plugOptions);
        });

        this.locObject = this.navParams.get("location");
        this.connector = this.locObject.stations[0].connectors[0];

        this.flowMode = this.navParams.get("mode");
        this.wattpowerTemp = this.connector.wattpower / 1000;

        this.clearErrorMessages();
    }

    ionViewDidLoad() {
    }

    updateWattpower() {
        this.connector.wattpower = this.wattpowerTemp * 1000;
    }

    nextPage() {
        if (this.validateForm()) {
            if (!this.connector.metadata.accessControl) {
                this.connector.metadata.kwh = false
            }
            this.navCtrl.push(SetTariffPage, {
                "location": this.locObject,
                "mode": this.flowMode
            });
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

    clearErrorMessages() {
        this.errorMessages = {
            "plugType": '',
            "capacity": ''
        }
    }

    validateForm() {
        let hasError = false;
        this.clearErrorMessages();
        if (this.connector.plugtype.length == 0) {
            hasError = true;
            this.errorMessages.plugType = 'Bitte wählen Sie einen Steckertyp';
        }
        if (!this.wattpowerTemp) {
            hasError = true;

            this.errorMessages.capacity = 'Bitte wählen Sie eine Leistung';
        }
        return !hasError;
    }
}
