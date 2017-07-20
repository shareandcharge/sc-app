import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ModalController, Events} from 'ionic-angular';
import {AddPermissionsPage} from './add-permissions/add-permissions';
import {Location} from "../../../models/location";
import {Connector} from "../../../models/connector";
import {TariffConfirmationPage} from "./tariff-confirmation/tariff-confirmation";
import {TrackerService} from "../../../services/tracker.service";
import {TranslateService} from "@ngx-translate/core";
import {CurrencyService} from "../../../services/currency.service";


@Component({
    selector: 'page-set-tariff',
    templateUrl: 'set-tariff.html',
    providers: []

})
export class SetTariffPage {
    locObject: Location;
    connector: Connector;
    priceprovider: any;

    flowMode: any;
    buttonText: any;

    hourlyTariff = false;
    kwhTariff = false;

    estimatedPrice: any;

    currency: any = "";

    constructor(public navCtrl: NavController, private alertCtrl: AlertController, private modalCtrl: ModalController,
                private navParams: NavParams, private events: Events, private trackerService: TrackerService,
                private translateService: TranslateService, private currencyService: CurrencyService) {
        this.locObject = this.navParams.get("location");
        this.connector = this.locObject.stations[0].connectors[0];
        this.priceprovider = this.connector.priceprovider;

        this.flowMode = this.navParams.get("mode");

        if (this.flowMode == 'add') {
            this.buttonText = this.translateService.instant('station.add');
        }
        else {
            this.buttonText = this.translateService.instant('station.save_changes');
        }

        if (this.connector.metadata.accessControl) {
            this.hourlyTariff = true;
            if (this.connector.metadata.kwh) {
                this.kwhTariff = true;
                this.hourlyTariff = false;
            }
        }

        // when the user switches between hourly/kwh, make sure we have the correct segment selected (or at least one)
        if (this.priceprovider.public.selected == 'kwh' && !this.kwhTariff) {
            this.priceprovider.public.selected = 'hourly';
        }
        else if (this.priceprovider.public.selected == 'hourly' && !this.hourlyTariff) {
            this.priceprovider.public.selected = 'kwh';
        }
        if (this.priceprovider.private.selected == 'kwh' && !this.kwhTariff) {
            this.priceprovider.private.selected = 'hourly';
        }
        else if (this.priceprovider.private.selected == 'hourly' && !this.hourlyTariff) {
            this.priceprovider.private.selected = 'kwh';
        }

        //-- check at least one ist selected
        this.estimatedPrice = {
            publicHourly: {small: 0, medium: 0, big: 0},
            publicKwh: {small: 0, medium: 0, big: 0},
            privateHourly: {small: 0, medium: 0, big: 0},
            privateKwh: {small: 0, medium: 0, big: 0}
        };

        if (this.navParams.get('setTariffAlert')) {
            this.showSetTariffAlert();
        }
        
        this.currency = this.currencyService.getCurrency();
    }

    ionViewDidEnter() {
        this.trackerService.track('Started Tariff Type - ' + (this.isAdd() ? 'Add' : 'Edit'), {});
    }

    showHelp(type) {
        let message = "";

        switch (type) {
            case "flatrate":
                message = this.translateService.instant('station.flatrate_message');
                break;
            case "hourly":
                message = this.translateService.instant('station.hourly_message');
                break;
            case "parking":
                message = this.translateService.instant('station.parking_message');
                break;
        }

        let alert = this.alertCtrl.create({
            title: 'Info',
            message: message,
            buttons: [this.translateService.instant('common.ok')]
        });
        alert.present();
    }

    updatePriceProvider(from, to, property, area?) {
        let val = from.target.value;
        to[property] = isNaN(val) ? 0 : Math.round(val * 100);
    }

    addPermission() {
        let modal = this.modalCtrl.create(AddPermissionsPage, {
            "permissions": this.priceprovider.private.permissions
        });

        modal.onDidDismiss(permissions => {
            this.priceprovider.private.permissions = permissions;
        });

        modal.present();
    }

    publish() {
        if (this.priceprovider.public.active || this.priceprovider.private.active) {

            this.trackerService.track('Publish Tariff Type - ' + (this.isAdd() ? 'Add' : 'Edit'), {});

            if (this.flowMode === 'add') {
                this.navCtrl.push(TariffConfirmationPage, {
                    'flowMode': this.flowMode,
                    'location': this.locObject
                });
            } else {
                this.events.publish('locations:update', this.locObject);
            }
        } else {
            this.showSetTariffAlert();
        }
    }

    showSetTariffAlert() {
        let alert = this.alertCtrl.create({
            title: this.translateService.instant('station.choose_tarif'),
            subTitle: this.translateService.instant('station.choose_tarif_notice'),
            buttons: [this.translateService.instant('common.ok')]
        });
        alert.present();
    }

    close() {
        this.navCtrl.parent.pop();
    }

    isAdd() {
        return this.flowMode == 'add';
    }
}
