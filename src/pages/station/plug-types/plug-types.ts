import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, Events} from 'ionic-angular';
import {SetTariffPage} from '../set-tariff/set-tariff';
import {Location} from "../../../models/location";
import {Connector} from "../../../models/connector";
import {ConfigService} from "../../../services/config.service";
import {ErrorService} from "../../../services/error.service";
import {TrackerService} from "../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";
import {JuiceBoxPage} from "../juice-box/juice-box";


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

    displayJuiceBoxOption: boolean = false;
    juiceBoxPlugTypeId: any;
    nextView: any;
    isScModuleOptionAvailable: boolean = false;

    private selectPlugTypeTitle: string;
    private selectPowerTitle: string;

    constructor(public navCtrl: NavController, private navParams: NavParams, public alertCtrl: AlertController,
                private configService: ConfigService, private events: Events, private errorService: ErrorService,
                private trackerService: TrackerService, private translateService: TranslateService) {
        this.powerOptions = [
            "2.4", "4.3", "6.4"
        ];

        this.selectPlugTypeTitle = this.translateService.instant('location.location_details.list_plugins');
        this.selectPowerTitle = this.translateService.instant('station.power');

        this.configService.getPlugTypes().subscribe((plugtypes) => {
                this.plugOptions = plugtypes;

                this.plugOptions.forEach((plugType) => {
                    if (plugType.name === 'Typ 1') {
                        this.juiceBoxPlugTypeId = plugType.id;
                    }
                });
            },
            error => this.errorService.displayErrorWithKey(error, 'error.scope.get_plugtypes'));

        this.displayJuiceBoxOption = this.configService.isFeatureEnabled("show_juicebox_config");

        this.locObject = this.navParams.get("location");
        this.connector = this.locObject.stations[0].connectors[0];

        this.flowMode = this.navParams.get("mode");
        this.wattpowerTemp = this.connector.maxwattpower / 1000;

        this.isScModuleOptionAvailable = !configService.isFeatureEnabled('hide_sc_module');

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

            // Comment this IF statement if you need to allow KWH for JuiceBox
            if (!this.connector.metadata.accessControl) {
                this.connector.metadata.kwh = false
            }

            this.nextView = SetTariffPage;
            if (this.connector.metadata.juiceBox && this.isAdd()) {
                this.nextView = JuiceBoxPage;
            }

            this.navCtrl.push(this.nextView, {
                "location": this.locObject,
                "mode": this.flowMode
            });
        }
    }

    showRadiogroup() {
      return (this.isScModuleOptionAvailable || this.displayJuiceBoxOption);
    }

    showHelp(type) {
        let message = "";

        if ("none" === type) {
            message = this.translateService.instant('station.msg_none');
        }
        else if ("accessControl" === type) {
          message = this.translateService.instant('station.msg_sc_light_module');
        }
        else if ("kwh" === type) {
            // changed in https://github.com/slockit/sc-app/issues/203
            // message = "Wähle diese Option sofern dein Ladepunkt über einen geeichten Stromzähler verfügt " +
            //     "& der Zählerstand automatisch an das Share&Charge Backend gesendet wird.";
            message = this.translateService.instant('station.msg_kwh_type');
        } else if ("juiceBox" === type) {
            message = this.translateService.instant('station.msg_juice_box');
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

    toggleJuiceBox() {
        if (!this.plugOptions) {
            return;
        }

        if (this.connector.metadata.juiceBox) {
            this.wattpowerTemp = 10;
            this.updateWattpower();

            this.connector.plugtype = this.juiceBoxPlugTypeId;

            this.connector.metadata.kwh = false;
            this.connector.metadata.accessControl = false;

            this.connector.metadata.operator = 'eMotorWerks';
        } else {
            this.connector.metadata.deviceId = '';
            this.connector.metadata.guestPin = '';
            this.connector.metadata.operator = '';
        }
    }

    setMetadata(value) {
    if (value === "juiceBox") {
      this.connector.metadata.accessControl = false;
      this.connector.metadata.juiceBox= true;
    }
    else if (value === "accessControl") {
      this.connector.metadata.accessControl = true;
      this.connector.metadata.juiceBox= false;
    }
    else{
      this.connector.metadata.accessControl = false;
      this.connector.metadata.juiceBox= false;
    }
    this.toggleJuiceBox();
    return true;
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
