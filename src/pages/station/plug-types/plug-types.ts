import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, Events} from 'ionic-angular';
import {SetTariffPage} from '../set-tariff/set-tariff';
import {Location} from "../../../models/location";
import {Connector} from "../../../models/connector";
import {ConfigService} from "../../../services/config.service";
import {ErrorService} from "../../../services/error.service";
import {TrackerService} from "../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";


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

    constructor(public navCtrl: NavController, private navParams: NavParams, public alertCtrl: AlertController,
                private configService: ConfigService, private events: Events, private errorService: ErrorService,
                private trackerService: TrackerService, private translateService: TranslateService) {
        this.powerOptions = [
            "2.4", "4.3", "6.4"
        ];

        this.configService.getPlugTypes().subscribe((plugtypes) => {
                this.plugOptions = plugtypes;
            },
            error => this.errorService.displayErrorWithKey(error, 'error.scope.get_plugtypes'));

        this.locObject = this.navParams.get("location");
        this.connector = this.locObject.stations[0].connectors[0];

        this.flowMode = this.navParams.get("mode");
        this.wattpowerTemp = this.connector.maxwattpower / 1000;

        this.clearErrorMessages();
    }

    ionViewDidEnter() {
        this.trackerService.track('Started Connector Type - ' + (this.isAdd() ? 'Add' : 'Edit'), {});
    }

    updateWattpower() {
        this.connector.maxwattpower = this.wattpowerTemp * 1000;
        this.errorMessages.capacity = '';
    }

    saveChanges() {
        this.trackerService.track('Save Connector type - ' + (this.isAdd() ? 'Add' : 'Edit'), {});

        if (this.connector.atLeastOneTarifSelected()) {
            this.events.publish('locations:update', this.locObject);
        } else {
            this.navCtrl.push(SetTariffPage, {
                "location": this.locObject,
                "mode": this.flowMode,
                "setTariffAlert": true
            });
        }
    }

    nextPage() {
        if (this.validateForm()) {
            this.trackerService.track('Proceed Connector Type - ' + (this.isAdd() ? 'Add' : 'Edit'), {});

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
            message = this.translateService.instant('station.msg_sc_light_module');
        }
        else if ("kwh" === type) {
            // changed in https://github.com/slockit/sc-app/issues/203
            // message = "Wähle diese Option sofern dein Ladepunkt über einen geeichten Stromzähler verfügt " +
            //     "& der Zählerstand automatisch an das Share&Charge Backend gesendet wird.";
            message = this.translateService.instant('station.msg_kwh_type');
        }

        let alert = this.alertCtrl.create({
            title: this.translateService.instant('common.info'),
            message: message,
            buttons: [this.translateService.instant('common.ok')]
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

    plugTypeDirty() {
        this.errorMessages.plugType = '';
    }

    validateForm() {
        let hasError = false;
        this.clearErrorMessages();
        if (this.connector.plugtype.length == 0) {
            hasError = true;
            this.errorMessages.plugType = this.translateService.instant('error_messages.choose_plugtype');
        }
        if (!this.wattpowerTemp) {
            hasError = true;

            this.errorMessages.capacity = this.translateService.instant('error_messages.choose_power');
        }
        return !hasError;
    }

    isAdd() {
        return this.flowMode == 'add';
    }
}
