import {Component} from '@angular/core';
import {NavController, NavParams, AlertController, ModalController, Events} from 'ionic-angular';
import {LocationService} from "../../../services/location.service";
import {AddPermissionsPage} from './add-permissions/add-permissions';
import {Location} from "../../../models/location";
import {Connector} from "../../../models/connector";
import {ErrorService} from "../../../services/error.service";
import {debounce} from "ionic-angular/util/util";


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

    updateEstimationsDebounce;

    estimatedPrice: any;

    constructor(public navCtrl: NavController, private alertCtrl: AlertController, private modalCtrl: ModalController, private navParams: NavParams, public locationService: LocationService, private events: Events, private errorService: ErrorService) {
        this.locObject = this.navParams.get("location");
        this.connector = this.locObject.stations[0].connectors[0];
        this.priceprovider = this.connector.priceprovider;

        this.flowMode = this.navParams.get("mode");

        if (this.flowMode == 'add') {
            this.buttonText = "Veröffentlichen";
        }
        else {
            this.buttonText = "Änderungen speichern";
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

        this.updateEstimationsDebounce = debounce((area) => this.updateEstimations(area), 400);

        if (this.navParams.get('setTariffAlert')) {
            this.showSetTariffAlert();
        }
    }

    ionViewWillEnter() {
        this.updateEstimations('publicHourly');
        this.updateEstimations('publicKwh');
        this.updateEstimations('privateHourly');
        this.updateEstimations('privateKwh');
    }

    showHelp(type) {
        let message = "";

        switch (type) {
            case "flatrate":
                message = "Pauschaler Betrag für eine maximale Ladedauer von 8 Stunden.";
                break;
            case "hourly":
                message = "Hier trägst Du die Energiekosten ein, die Du an Deinen Energieversorger bezahlst.";
                break;
            case "parking":
                message = "Hier trägst Du die Kosten ein, die Lader an Dich für die Nutzung deines Parkplatzes zahlen sollen.";
                break;
        }

        let alert = this.alertCtrl.create({
            title: 'Info',
            message: message,
            buttons: ['Ok']
        });
        alert.present();
    }

    updatePriceProvider(from, to, property, area?) {
        let val = from.target.value;
        to[property] = isNaN(val) ? 0 : Math.round(val * 100);

        if (area) {
            this.updateEstimationsDebounce(area);
        }
    }

    updateEstimations(area) {
        let pricePerHour, pricePerKW;

        switch (area) {
            case 'publicHourly':
                pricePerHour = this.priceprovider.public.hourly.parkRate;
                pricePerKW = this.priceprovider.public.hourly.hourlyRate;
                break;
            case 'publicKwh':
                pricePerHour = this.priceprovider.public.kwh.parkRate;
                pricePerKW = this.priceprovider.public.kwh.kwhRate;
                break;
            case 'privateHourly':
                pricePerHour = this.priceprovider.private.hourly.parkRate;
                pricePerKW = this.priceprovider.private.hourly.hourlyRate;
                break;
            case 'privateKwh':
                pricePerHour = this.priceprovider.private.kwh.parkRate;
                pricePerKW = this.priceprovider.private.kwh.kwhRate;
                break;
        }
        this.locationService.getEstimatedPrice(pricePerHour, pricePerKW)
            .subscribe(
                (res) => {
                    this.estimatedPrice[area] = {
                        small: res.small.price,
                        medium: res.medium.price,
                        big: res.big.price
                    }
                },
                error => this.errorService.displayErrorWithKey(error, 'Geschätzter Tarif')
            );
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
        console.log(this.locObject);
        if (this.priceprovider.public.active || this.priceprovider.private.active) {
            if (this.flowMode == 'add') {
                this.events.publish('locations:create', this.locObject);
            } else {
                this.events.publish('locations:update', this.locObject);
            }
        } else {
            this.showSetTariffAlert();
        }
    }

    showSetTariffAlert() {
        let alert = this.alertCtrl.create({
            title: 'Bitte wähle eine Tarifoption',
            subTitle: 'Es muss mindestens ein Tarifoption ausgewählt sein.',
            buttons: ['Ok']
        });
        alert.present();
    }

    close() {
        this.navCtrl.parent.pop();
    }
}
