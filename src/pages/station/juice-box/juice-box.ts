import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, Events} from 'ionic-angular';
import {SetTariffPage} from '../set-tariff/set-tariff';
import {Location} from "../../../models/location";
import {Connector} from "../../../models/connector";
import {TrackerService} from "../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";
import {Station} from "../../../models/station";


@Component({
    selector: 'page-juice-box',
    templateUrl: 'juice-box.html'
})
export class JuiceBoxPage {
    locObject: Location;
    station: Station;
    connector: Connector;

    flowMode: any;

    errorMessages: any;

    constructor(public navCtrl: NavController, private navParams: NavParams, public alertCtrl: AlertController,
                private events: Events, private trackerService: TrackerService, private translateService: TranslateService) {

        this.locObject = this.navParams.get("location");
        this.station = this.locObject.stations[0];
        this.connector = this.station.connectors[0];

        this.flowMode = this.navParams.get("mode");

        this.clearErrorMessages();
    }

    ionViewDidEnter() {
        this.trackerService.track('Started JuiceBox - ' + (this.isAdd() ? 'Add' : 'Edit'), {});
    }

    saveChanges() {
        this.trackerService.track('Save JuiceBox - ' + (this.isAdd() ? 'Add' : 'Edit'), {});

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
            this.trackerService.track('Proceed JuiceBox - ' + (this.isAdd() ? 'Add' : 'Edit'), {});

            this.navCtrl.push(SetTariffPage, {
                "location": this.locObject,
                "mode": this.flowMode
            });
        }
    }

    close() {
        this.navCtrl.parent.pop();
    }

    clearErrorMessages() {
        this.errorMessages = {
            "deviceId": '',
            "guestPin": ''
        }
    }

    validateForm() {
        let hasError = false;
        this.clearErrorMessages();

        if (isNaN(Number(this.connector.metadata.deviceId))) {
            hasError = true;
            this.errorMessages.deviceId = this.translateService.instant('error_messages.device_id');
        }

        if (this.connector.metadata.guestPin.length !== 4 || isNaN(Number(this.connector.metadata.guestPin))) {
            hasError = true;
            this.errorMessages.guestPin = this.translateService.instant('error_messages.guest_pin');
        }

        return !hasError;
    }

    isAdd() {
        return this.flowMode == 'add';
    }
}
